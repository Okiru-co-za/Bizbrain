import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

type TimeEntry = {
  id: string
  date: string
  hoursWorked: number
  notes?: string
  user: { name?: string; email: string }
}

type User = { id: string; name?: string; email: string }

function isUnusual(entry: TimeEntry) {
  return entry.hoursWorked <= 0 || entry.hoursWorked > 12
}

export default function TimeEntriesPage() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [userId, setUserId] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [hours, setHours] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function load() {
    return fetch('/api/time-entries')
      .then((r) => r.json())
      .then((d) => setTimeEntries(d.timeEntries || []))
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
    if (!userId || !date || !hours) {
      setError('Employee, date and hours are required')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, date, hoursWorked: parseFloat(hours), notes: notes || undefined })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to log time entry')
        return
      }
      setHours('')
      setNotes('')
      await load()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Time Entries</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm mb-6">
        <h2 className="font-medium mb-3">Log hours</h2>
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
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded" />
          <input
            type="number"
            step="0.5"
            placeholder="Hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="p-2 border rounded"
          />
          <input placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="p-2 border rounded" />
        </div>
        <button disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {submitting ? 'Saving…' : 'Log hours'}
        </button>
      </form>

      <div className="grid gap-3">
        {timeEntries.map((entry) => (
          <div key={entry.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{entry.user.name || entry.user.email}</div>
              <div className="text-sm text-gray-600">
                {new Date(entry.date).toLocaleDateString('en-ZA')}
                {entry.notes && ` • ${entry.notes}`}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{entry.hoursWorked}h</span>
              {isUnusual(entry) && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Unusual</span>
              )}
            </div>
          </div>
        ))}
        {!loading && timeEntries.length === 0 && <div className="text-sm text-gray-600">No time entries yet.</div>}
      </div>
    </Layout>
  )
}
