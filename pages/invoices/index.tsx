import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

type Invoice = {
  id: string
  invoiceNumber: string
  status: string
  totalCents: number
  dueDate?: string
  customer?: { name: string; businessName?: string; email?: string } | null
  items: { id: string }[]
}

type Customer = { id: string; name: string; businessName?: string }

type LineItem = { description: string; quantity: number; unitPrice: string }

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-200 text-gray-600',
  SENT: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-200 text-gray-600'
}

function isOverdue(invoice: Invoice) {
  return invoice.status === 'SENT' && invoice.dueDate && new Date(invoice.dueDate) < new Date()
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const [customerId, setCustomerId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: '', quantity: 1, unitPrice: '' }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function loadInvoices() {
    return fetch('/api/invoices')
      .then((r) => r.json())
      .then((d) => setInvoices(d.invoices || []))
  }

  useEffect(() => {
    Promise.all([
      loadInvoices(),
      fetch('/api/customers')
        .then((r) => r.json())
        .then((d) => setCustomers(d.customers || []))
    ]).finally(() => setLoading(false))
  }, [])

  function updateLineItem(index: number, patch: Partial<LineItem>) {
    setLineItems((items) => items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function addLineItem() {
    setLineItems((items) => [...items, { description: '', quantity: 1, unitPrice: '' }])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const items = lineItems
        .filter((item) => item.description.trim() && item.unitPrice)
        .map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPriceCents: Math.round(parseFloat(item.unitPrice) * 100)
        }))

      if (items.length === 0) {
        setError('Add at least one line item with a description and price')
        return
      }

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customerId || undefined, dueDate: dueDate || undefined, items })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to create invoice')
        return
      }

      setCustomerId('')
      setDueDate('')
      setLineItems([{ description: '', quantity: 1, unitPrice: '' }])
      await loadInvoices()
    } finally {
      setSubmitting(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/invoices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    await loadInvoices()
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Invoices</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm mb-6">
        <h2 className="font-medium mb-3">New invoice</h2>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm mb-1">Customer (optional)</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">No customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.businessName || c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="space-y-2 mb-3">
          {lineItems.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateLineItem(i, { description: e.target.value })}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateLineItem(i, { quantity: parseInt(e.target.value, 10) || 1 })}
                className="w-20 p-2 border rounded"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Unit price (R)"
                value={item.unitPrice}
                onChange={(e) => updateLineItem(i, { unitPrice: e.target.value })}
                className="w-32 p-2 border rounded"
              />
            </div>
          ))}
          <button type="button" onClick={addLineItem} className="text-sm text-blue-600">
            + Add line item
          </button>
        </div>

        <button disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {submitting ? 'Creating…' : 'Create invoice'}
        </button>
      </form>

      <div className="grid gap-3">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-medium">
                {invoice.invoiceNumber} — {invoice.customer?.businessName || invoice.customer?.name || 'No customer'}
              </div>
              <div className="text-sm text-gray-600">
                {invoice.items.length} item{invoice.items.length === 1 ? '' : 's'}
                {invoice.dueDate && ` • due ${new Date(invoice.dueDate).toLocaleDateString('en-ZA')}`}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">R{(invoice.totalCents / 100).toLocaleString('en-ZA')}</span>
              {isOverdue(invoice) && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Overdue</span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[invoice.status] || 'bg-gray-100 text-gray-600'}`}>
                {invoice.status.toLowerCase()}
              </span>
              {invoice.status === 'DRAFT' && (
                <button onClick={() => updateStatus(invoice.id, 'SENT')} className="text-sm text-blue-600">
                  Mark sent
                </button>
              )}
              {invoice.status === 'SENT' && (
                <button onClick={() => updateStatus(invoice.id, 'PAID')} className="text-sm text-blue-600">
                  Mark paid
                </button>
              )}
              {(invoice.status === 'DRAFT' || invoice.status === 'SENT') && (
                <button onClick={() => updateStatus(invoice.id, 'CANCELLED')} className="text-sm text-gray-500">
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
        {!loading && invoices.length === 0 && <div className="text-sm text-gray-600">No invoices yet.</div>}
      </div>
    </Layout>
  )
}
