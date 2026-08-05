import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

type InboxItem = {
  id: string
  source: string
  sender?: string
  subject?: string
  message?: string
  receivedAt: string
  priority?: string
  status?: string
}

const PRIORITY_STYLES: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-gray-200 text-gray-600'
}

export default function InboxPage() {
  const [items, setItems] = useState<InboxItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/inbox')
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Inbox</h1>
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{item.subject || '(no subject)'}</div>
              <div className="text-sm text-gray-600">
                {item.sender}
                {item.sender && ' • '}
                {item.source} • {new Date(item.receivedAt).toLocaleDateString('en-ZA')}
              </div>
            </div>
            {item.priority && (
              <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_STYLES[item.priority] || 'bg-gray-100 text-gray-600'}`}>
                {item.priority}
              </span>
            )}
          </div>
        ))}
        {!loading && items.length === 0 && <div className="text-sm text-gray-600">No inbox items yet.</div>}
      </div>
    </Layout>
  )
}
