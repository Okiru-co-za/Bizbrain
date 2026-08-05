import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

type Opportunity = {
  id: string
  name: string
  description?: string
  amountCents?: number
  probability?: number
  stage?: string
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/opportunities')
      .then((r) => r.json())
      .then((d) => setOpportunities(d.opportunities || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Opportunities</h1>
      <div className="grid gap-3">
        {opportunities.map((opp) => (
          <div key={opp.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{opp.name}</div>
              <div className="text-sm text-gray-600">{opp.description}</div>
            </div>
            <div className="flex items-center gap-3">
              {typeof opp.amountCents === 'number' && (
                <span className="text-sm text-gray-700">R{(opp.amountCents / 100).toLocaleString('en-ZA')}</span>
              )}
              {typeof opp.probability === 'number' && (
                <span className="text-sm text-gray-500">{opp.probability}%</span>
              )}
              {opp.stage && (
                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">{opp.stage}</span>
              )}
            </div>
          </div>
        ))}
        {!loading && opportunities.length === 0 && <div className="text-sm text-gray-600">No opportunities yet.</div>}
      </div>
    </Layout>
  )
}
