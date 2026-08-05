import Layout from '../../components/Layout'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Approval = {
  id: string
  action: string
  reason?: string
  riskLevel?: string
  entity?: string
  entityId?: string
  createdAt: string
}

const RISK_STYLES: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  LOW: 'bg-gray-200 text-gray-600'
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    return fetch('/api/approvals')
      .then((r) => r.json())
      .then((d) => setApprovals(d.approvals || []))
  }

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  async function decide(id: string, status: 'APPROVED' | 'REJECTED') {
    await fetch(`/api/approvals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    await load()
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Approvals</h1>
      <div className="grid gap-3">
        {approvals.map((approval) => (
          <div key={approval.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{approval.action.replace(/_/g, ' ')}</div>
              <div className="text-sm text-gray-600">
                {approval.reason}
                {approval.entity === 'Invoice' && approval.entityId && (
                  <>
                    {' • '}
                    <Link href="/invoices" className="text-blue-600">
                      view invoices
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {approval.riskLevel && (
                <span className={`text-xs px-2 py-1 rounded-full ${RISK_STYLES[approval.riskLevel] || 'bg-gray-100 text-gray-600'}`}>
                  {approval.riskLevel.toLowerCase()}
                </span>
              )}
              <button onClick={() => decide(approval.id, 'APPROVED')} className="text-sm text-green-600">
                Approve
              </button>
              <button onClick={() => decide(approval.id, 'REJECTED')} className="text-sm text-red-600">
                Reject
              </button>
            </div>
          </div>
        ))}
        {!loading && approvals.length === 0 && <div className="text-sm text-gray-600">No pending approvals.</div>}
      </div>
    </Layout>
  )
}
