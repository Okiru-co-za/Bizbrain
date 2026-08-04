import Layout from '../components/Layout'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <h1 className="text-2xl font-semibold mb-4">Good morning. Here's what needs attention.</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <h3 className="font-medium">Today's priorities</h3>
              <ul className="mt-2 text-sm space-y-1">
                <li>• 3 leads requiring follow-up</li>
                <li>• 2 quotations waiting for approval</li>
                <li>• 1 customer request unanswered</li>
              </ul>
              <div className="mt-3">
                <Link href="/assistant" className="text-sm text-blue-600">Ask the assistant</Link>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
              <h3 className="font-medium">Business summary</h3>
              <div className="mt-2 text-sm space-y-1">
                <div>New leads: <strong>5</strong></div>
                <div>Active opportunities: <strong>4</strong></div>
                <div>Quotes sent: <strong>8</strong></div>
                <div>Quotes accepted: <strong>2</strong></div>
                <div>Estimated pipeline value: <strong>R68,000</strong></div>
              </div>
            </div>
          </div>
        </div>

        <aside>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium">Assistant briefing</h3>
            <p className="mt-2 text-sm">Good morning. You have three leads requiring follow-up, two quotations waiting for approval, and one customer request that has not received a response.</p>
            <div className="mt-3 flex gap-2">
              <Link href="/assistant" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Review priorities</Link>
              <Link href="/quotes" className="px-3 py-1 border rounded text-sm">Approve drafts</Link>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  )
}
