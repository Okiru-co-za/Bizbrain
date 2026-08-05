import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

type Report = {
  customerCount: number
  leadsByStatus: { status: string; count: number }[]
  opportunities: { count: number; pipelineValueCents: number }
  quotesByStatus: { status: string; count: number }[]
}

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reports')
      .then((r) => r.json())
      .then((d) => setReport(d))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Reports</h1>
      {loading && <div className="text-sm text-gray-600">Loading…</div>}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2">Customers</h3>
            <div className="text-2xl font-semibold">{report.customerCount}</div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2">Pipeline</h3>
            <div className="text-2xl font-semibold">
              R{(report.opportunities.pipelineValueCents / 100).toLocaleString('en-ZA')}
            </div>
            <div className="text-sm text-gray-600">{report.opportunities.count} open opportunities</div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2">Leads by status</h3>
            <ul className="text-sm space-y-1">
              {report.leadsByStatus.map((row) => (
                <li key={row.status} className="flex justify-between">
                  <span className="text-gray-600">{row.status.replace(/_/g, ' ').toLowerCase()}</span>
                  <span className="font-medium">{row.count}</span>
                </li>
              ))}
              {report.leadsByStatus.length === 0 && <li className="text-gray-500">No leads yet.</li>}
            </ul>
          </div>

          <div className="bg-white p-4 rounded shadow-sm sm:col-span-2">
            <h3 className="font-medium mb-2">Quotes by status</h3>
            <ul className="text-sm space-y-1">
              {report.quotesByStatus.map((row) => (
                <li key={row.status} className="flex justify-between">
                  <span className="text-gray-600">{row.status.replace(/_/g, ' ').toLowerCase()}</span>
                  <span className="font-medium">{row.count}</span>
                </li>
              ))}
              {report.quotesByStatus.length === 0 && <li className="text-gray-500">No quotes yet.</li>}
            </ul>
          </div>
        </div>
      )}
    </Layout>
  )
}
