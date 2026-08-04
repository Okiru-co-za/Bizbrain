import Layout from '../components/Layout'
import { useState } from 'react'

export default function Assistant() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([])

  async function send() {
    if (!input.trim()) return
    setMessages((m) => [...m, { from: 'user', text: input }])
    // Development fallback: echo response
    setMessages((m) => [...m, { from: 'assistant', text: 'Draft created: ' + input }])
    setInput('')
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Assistant</h1>
      <div className="bg-white p-4 rounded shadow-sm">
        <div className="space-y-3 mb-4">
          {messages.map((m, i) => (
            <div key={i} className={m.from === 'user' ? 'text-right' : 'text-left'}>
              <div className="inline-block bg-gray-100 p-2 rounded">{m.text}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Ask the assistant..." />
          <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
        </div>
      </div>
    </Layout>
  )
}
