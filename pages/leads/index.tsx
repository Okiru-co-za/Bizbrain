import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

type Lead = {
  id: string
  name: string
  businessName?: string
  email?: string
  phone?: string
  source?: string
  industry?: string
  estimatedValue?: number
  status: string
}

const STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  PROPOSAL_REQUIRED: 'Proposal required',
  QUOTE_SENT: 'Quote sent',
  NEGOTIATING: 'Negotiating',
  WON: 'Won',
  LOST: 'Lost',
  ON_HOLD: 'On hold'
}

const STATUS_STYLES: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-amber-100 text-amber-700',
  QUALIFIED: 'bg-amber-100 text-amber-700',
  PROPOSAL_REQUIRED: 'bg-amber-100 text-amber-700',
  QUOTE_SENT: 'bg-purple-100 text-purple-700',
  NEGOTIATING: 'bg-purple-100 text-purple-700',
  WON: 'bg-green-100 text-green-700',
  LOST: 'bg-gray-200 text-gray-600',
  ON_HOLD: 'bg-gray-200 text-gray-600'
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leads')
      .then((r) => r.json())
      .then((d) => setLeads(d.leads || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Leads</h1>
      <div className="grid gap-3">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{lead.businessName || lead.name}</div>
              <div className="text-sm text-gray-600">
                {lead.email}
                {lead.email && lead.phone && ' • '}
                {lead.phone}
                {lead.source && ` • via ${lead.source}`}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {typeof lead.estimatedValue === 'number' && (
                <span className="text-sm text-gray-700">R{lead.estimatedValue.toLocaleString('en-ZA')}</span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[lead.status] || 'bg-gray-100 text-gray-600'}`}>
                {STATUS_LABELS[lead.status] || lead.status}
              </span>
            </div>
          </div>
        ))}
        {!loading && leads.length === 0 && <div className="text-sm text-gray-600">No leads yet.</div>}
      </div>
    </Layout>
  )
}
