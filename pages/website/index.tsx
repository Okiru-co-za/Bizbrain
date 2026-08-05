import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

type Website = {
  domain?: string
  title?: string
  published: boolean
}

export default function WebsitePage() {
  const [website, setWebsite] = useState<Website | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/website')
      .then((r) => r.json())
      .then((d) => setWebsite(d.website))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Website</h1>
      {loading && <div className="text-sm text-gray-600">Loading…</div>}
      {!loading && website && (
        <div className="bg-white p-4 rounded shadow-sm max-w-md">
          <div className="font-medium">{website.title || 'Untitled site'}</div>
          <div className="text-sm text-gray-600 mb-3">{website.domain || 'No domain set'}</div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              website.published ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {website.published ? 'Published' : 'Draft'}
          </span>
        </div>
      )}
      {!loading && !website && <div className="text-sm text-gray-600">No website set up yet.</div>}
    </Layout>
  )
}
