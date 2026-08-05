import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

type OverviewRow = {
  userId: string
  name?: string
  email: string
  role: string
  pendingLeaveCount: number
  onboardingTasksPending: number
  missingTimeEntries: number
  unusualTimeEntries: number
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className={`text-sm ${value > 0 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
      {value} {label}
    </div>
  )
}

export default function HrOverviewPage() {
  const [overview, setOverview] = useState<OverviewRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/hr/overview')
      .then((r) => r.json())
      .then((d) => setOverview(d.overview || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">HR Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {overview.map((row) => (
          <div key={row.userId} className="bg-white p-4 rounded shadow-sm">
            <div className="font-medium">{row.name || row.email}</div>
            <div className="text-sm text-gray-500 mb-2">{row.role}</div>
            <div className="space-y-1">
              <Stat label="pending leave requests" value={row.pendingLeaveCount} />
              <Stat label="onboarding tasks pending" value={row.onboardingTasksPending} />
              <Stat label="missing time entries (7d)" value={row.missingTimeEntries} />
              <Stat label="unusual time entries (30d)" value={row.unusualTimeEntries} />
            </div>
          </div>
        ))}
        {!loading && overview.length === 0 && <div className="text-sm text-gray-600">No team members yet.</div>}
      </div>
    </Layout>
  )
}
