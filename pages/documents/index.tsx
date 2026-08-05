import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

type Document = {
  id: string
  filename: string
  url: string
  contentType?: string
  createdAt: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/documents')
      .then((r) => r.json())
      .then((d) => setDocuments(d.documents || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Documents</h1>
      <div className="grid gap-3">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{doc.filename}</div>
              <div className="text-sm text-gray-600">
                {doc.contentType}
                {doc.contentType && ' • '}
                added {new Date(doc.createdAt).toLocaleDateString('en-ZA')}
              </div>
            </div>
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600">
              Open
            </a>
          </div>
        ))}
        {!loading && documents.length === 0 && <div className="text-sm text-gray-600">No documents yet.</div>}
      </div>
    </Layout>
  )
}
