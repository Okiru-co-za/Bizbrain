import Layout from '../../components/Layout'
import { useEffect, useMemo, useState } from 'react'

type VendorSubscription = {
  id: string
  name: string
  category?: string
  costCents: number
  currency: string
  billingCycle: string
  status: string
  nextRenewalAt?: string
  notes?: string
}

const CURRENCY_SYMBOLS: Record<string, string> = { ZAR: 'R', USD: '$', EUR: '€', GBP: '£' }

function formatAmount(cents: number, currency: string) {
  const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `
  return `${symbol}${(cents / 100).toLocaleString('en-ZA')}`
}

const CYCLE_LABELS: Record<string, string> = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
  ONCE_OFF: 'once-off'
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  TRIAL: 'bg-amber-100 text-amber-700',
  CANCELLED: 'bg-gray-200 text-gray-600'
}

const SUGGESTED_CATEGORIES = ['Cloud Hosting', 'AI / LLM', 'Web Hosting', 'Domain', 'Software', 'Other']

function monthlyEquivalentCents(sub: VendorSubscription) {
  switch (sub.billingCycle) {
    case 'WEEKLY':
      return sub.costCents * 4.345
    case 'ANNUAL':
      return sub.costCents / 12
    case 'ONCE_OFF':
      return 0
    default:
      return sub.costCents
  }
}

function isRenewingSoon(sub: VendorSubscription) {
  if (!sub.nextRenewalAt || sub.status === 'CANCELLED') return false
  const daysUntil = (new Date(sub.nextRenewalAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  return daysUntil >= 0 && daysUntil <= 14
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<VendorSubscription[]>([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [cost, setCost] = useState('')
  const [billingCycle, setBillingCycle] = useState('MONTHLY')
  const [nextRenewalAt, setNextRenewalAt] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<{ scanned: number; created: string[]; updated: string[] } | null>(null)

  function load() {
    return fetch('/api/vendor-subscriptions')
      .then((r) => r.json())
      .then((d) => setSubscriptions(d.vendorSubscriptions || []))
  }

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  async function scanInbox() {
    setScanning(true)
    setScanResult(null)
    try {
      const res = await fetch('/api/vendor-subscriptions/scan-inbox', { method: 'POST' })
      const data = await res.json()
      setScanResult(data)
      await load()
    } finally {
      setScanning(false)
    }
  }

  const monthlySpendByCurrency = useMemo(() => {
    const totals: Record<string, number> = {}
    subscriptions
      .filter((s) => s.status !== 'CANCELLED')
      .forEach((s) => {
        totals[s.currency] = (totals[s.currency] || 0) + monthlyEquivalentCents(s)
      })
    return totals
  }, [subscriptions])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name || !cost) {
      setError('Name and cost are required')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/vendor-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category: category || undefined,
          costCents: Math.round(parseFloat(cost) * 100),
          billingCycle,
          nextRenewalAt: nextRenewalAt || undefined,
          notes: notes || undefined
        })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to add subscription')
        return
      }
      setName('')
      setCategory('')
      setCost('')
      setNextRenewalAt('')
      setNotes('')
      await load()
    } finally {
      setSubmitting(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/vendor-subscriptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    await load()
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Subscriptions</h1>

      <div className="bg-white p-4 rounded shadow-sm mb-6">
        <h3 className="font-medium mb-1">Estimated monthly spend</h3>
        <div className="flex flex-col gap-1">
          {Object.entries(monthlySpendByCurrency).length === 0 && <div className="text-2xl font-semibold">R0</div>}
          {Object.entries(monthlySpendByCurrency).map(([currency, cents]) => (
            <div key={currency} className="text-2xl font-semibold">
              {formatAmount(Math.round(cents), currency)}
              <span className="text-sm font-normal text-gray-500 ml-2">{currency}/month</span>
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Across all active and trial subscriptions, normalized to a monthly amount.
          {Object.keys(monthlySpendByCurrency).length > 1 && ' Shown per currency - not converted.'}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm mb-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-medium mb-1">Detect subscriptions from vendor emails</h3>
            <p className="text-sm text-gray-600">Scans your Inbox for billing emails from known vendors (AWS, OpenAI, Figma, etc.) and adds or updates subscriptions automatically.</p>
          </div>
          <button onClick={scanInbox} disabled={scanning} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 whitespace-nowrap">
            {scanning ? 'Scanning…' : 'Scan inbox'}
          </button>
        </div>
        {scanResult && (
          <div className="text-sm text-gray-700 mt-3">
            Scanned {scanResult.scanned} inbox email{scanResult.scanned === 1 ? '' : 's'}.{' '}
            {scanResult.created.length === 0 && scanResult.updated.length === 0
              ? 'No vendor billing emails found.'
              : (
                <>
                  {scanResult.created.length > 0 && `Added: ${scanResult.created.join(', ')}. `}
                  {scanResult.updated.length > 0 && `Updated: ${scanResult.updated.join(', ')}.`}
                </>
              )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm mb-6">
        <h2 className="font-medium mb-3">New subscription</h2>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input placeholder="Name (e.g. Microsoft Azure)" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded" />
          <input
            list="subscription-categories"
            placeholder="Category (e.g. Cloud Hosting)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded"
          />
          <datalist id="subscription-categories">
            {SUGGESTED_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <input
            type="number"
            step="0.01"
            placeholder="Cost (R)"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="p-2 border rounded"
          />
          <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)} className="p-2 border rounded">
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="ANNUAL">Annual</option>
            <option value="ONCE_OFF">Once-off</option>
          </select>
          <input
            type="date"
            value={nextRenewalAt}
            onChange={(e) => setNextRenewalAt(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <input placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border rounded mb-3" />
        <button disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {submitting ? 'Adding…' : 'Add subscription'}
        </button>
      </form>

      <div className="grid gap-3">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-medium">
                {sub.name}
                {sub.category && <span className="text-sm text-gray-500"> • {sub.category}</span>}
              </div>
              <div className="text-sm text-gray-600">
                {formatAmount(sub.costCents, sub.currency)} / {CYCLE_LABELS[sub.billingCycle] || sub.billingCycle}
                {sub.nextRenewalAt && ` • renews ${new Date(sub.nextRenewalAt).toLocaleDateString('en-ZA')}`}
                {sub.notes && ` • ${sub.notes}`}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isRenewingSoon(sub) && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Renewing soon</span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[sub.status] || 'bg-gray-100 text-gray-600'}`}>
                {sub.status.toLowerCase()}
              </span>
              {sub.status !== 'CANCELLED' && (
                <button onClick={() => updateStatus(sub.id, 'CANCELLED')} className="text-sm text-gray-500">
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
        {!loading && subscriptions.length === 0 && <div className="text-sm text-gray-600">No subscriptions tracked yet.</div>}
      </div>
    </Layout>
  )
}
