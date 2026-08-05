import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

type Quote = {
  id: string
  status: string
  totalCents?: number
  validUntil?: string
  customer?: { name: string; businessName?: string } | null
  items: { id: string }[]
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-200 text-gray-600',
  AWAITING_INFORMATION: 'bg-amber-100 text-amber-700',
  AWAITING_APPROVAL: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  SENT: 'bg-purple-100 text-purple-700',
  VIEWED: 'bg-purple-100 text-purple-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  EXPIRED: 'bg-gray-200 text-gray-600',
  CANCELLED: 'bg-gray-200 text-gray-600'
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/quotes')
      .then((r) => r.json())
      .then((d) => setQuotes(d.quotes || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Quotes</h1>
      <div className="grid gap-3">
        {quotes.map((quote) => (
          <div key={quote.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-medium">
                {quote.customer?.businessName || quote.customer?.name || 'No customer'}
              </div>
              <div className="text-sm text-gray-600">
                {quote.items.length} item{quote.items.length === 1 ? '' : 's'}
                {quote.validUntil && ` • valid until ${new Date(quote.validUntil).toLocaleDateString('en-ZA')}`}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {typeof quote.totalCents === 'number' && (
                <span className="text-sm text-gray-700">R{(quote.totalCents / 100).toLocaleString('en-ZA')}</span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[quote.status] || 'bg-gray-100 text-gray-600'}`}>
                {quote.status.replace(/_/g, ' ').toLowerCase()}
              </span>
            </div>
          </div>
        ))}
        {!loading && quotes.length === 0 && <div className="text-sm text-gray-600">No quotes yet.</div>}
      </div>
    </Layout>
  )
}
