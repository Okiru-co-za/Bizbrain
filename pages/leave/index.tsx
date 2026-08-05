import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

type LeaveRequest = {
  id: string
  type: string
  startDate: string
  endDate: string
  reason?: string
  status: string
  user: { name?: string; email: string }
}

type User = { id: string; name?: string; email: string }

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700'
}

export default function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [userId, setUserId] = useState('')
  const [type, setType] = useState('ANNUAL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function load() {
    return fetch('/api/leave')
      .then((r) => r.json())
      .then((d) => setLeaveRequests(d.leaveRequests || []))
  }

  useEffect(() => {
    Promise.all([
      load(),
      fetch('/api/users')
        .then((r) => r.json())
        .then((d) => setUsers(d.users || []))
    ]).finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!userId || !startDate || !endDate) {
      setError('Employee, start date and end date are required')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type, startDate, endDate, reason: reason || undefined })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to submit leave request')
        return
      }
      setUserId('')
      setStartDate('')
      setEndDate('')
      setReason('')
      await load()
    } finally {
      setSubmitting(false)
    }
  }

  async function decide(id: string, status: 'APPROVED' | 'REJECTED') {
    await fetch(`/api/leave/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    await load()
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Leave</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm mb-6">
        <h2 className="font-medium mb-3">New leave request</h2>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
          <select value={userId} onChange={(e) => setUserId(e.target.value)} className="p-2 border rounded">
            <option value="">Employee</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name || u.email}
              </option>
            ))}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 border rounded">
            <option value="ANNUAL">Annual</option>
            <option value="SICK">Sick</option>
            <option value="UNPAID">Unpaid</option>
            <option value="OTHER">Other</option>
          </select>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded" />
        </div>
        <input
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <button disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {submitting ? 'Submitting…' : 'Submit request'}
        </button>
      </form>

      <div className="grid gap-3">
        {leaveRequests.map((leave) => (
          <div key={leave.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{leave.user.name || leave.user.email}</div>
              <div className="text-sm text-gray-600">
                {leave.type.toLowerCase()} • {new Date(leave.startDate).toLocaleDateString('en-ZA')} –{' '}
                {new Date(leave.endDate).toLocaleDateString('en-ZA')}
                {leave.reason && ` • ${leave.reason}`}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[leave.status] || 'bg-gray-100 text-gray-600'}`}>
                {leave.status.toLowerCase()}
              </span>
              {leave.status === 'PENDING' && (
                <>
                  <button onClick={() => decide(leave.id, 'APPROVED')} className="text-sm text-green-600">
                    Approve
                  </button>
                  <button onClick={() => decide(leave.id, 'REJECTED')} className="text-sm text-red-600">
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {!loading && leaveRequests.length === 0 && <div className="text-sm text-gray-600">No leave requests yet.</div>}
      </div>
    </Layout>
  )
}
