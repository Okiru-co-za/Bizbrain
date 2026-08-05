import Head from 'next/head'
import { FormEvent, KeyboardEvent, useState } from 'react'
import Layout from '../components/Layout'

type Message = { from: 'user' | 'assistant'; text: string }

const starters = ['Draft a client follow-up', 'Summarise my priorities', 'Create a quote outline']

export default function Assistant() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { from: 'assistant', text: 'Morning! I’m ready when you are. What would make today feel lighter?' }
  ])

  function send(event?: FormEvent) {
    event?.preventDefault()
    const message = input.trim()
    if (!message) return
    setMessages((current) => [...current, { from: 'user', text: message }, { from: 'assistant', text: `Draft created: ${message}` }])
    setInput('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <Layout>
      <Head><title>AI Assistant | BizBrain</title></Head>
      <div className="page-heading">
        <div><p className="page-kicker"><span /> Your clever co-pilot</p><h1>Ask BizBrain</h1><p>Turn the things in your head into clear, useful next steps.</p></div>
        <span className="online-pill"><i /> Ready to help</span>
      </div>

      <div className="assistant-layout">
        <section className="chat-panel">
          <div className="chat-header"><div className="assistant-avatar">✦</div><div><strong>BizBrain Assistant</strong><small>Knows your workspace context</small></div><button type="button" aria-label="Start a new conversation">＋ New chat</button></div>
          <div className="chat-messages" aria-live="polite">
            <div className="chat-day"><span>Today</span></div>
            {messages.map((message, index) => (
              <div className={`message ${message.from}`} key={`${message.from}-${index}`}>
                {message.from === 'assistant' && <span className="message-avatar">✦</span>}
                <div><p>{message.text}</p><time>{message.from === 'assistant' ? 'BizBrain · now' : 'You · now'}</time></div>
              </div>
            ))}
          </div>
          <form className="chat-composer" onSubmit={send}>
            <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about a customer, draft a message, plan your day…" rows={2} aria-label="Message BizBrain" />
            <div className="composer-footer"><span>↵ Send · Shift + ↵ new line</span><button type="submit" disabled={!input.trim()} aria-label="Send message">↑</button></div>
          </form>
        </section>

        <aside className="assistant-sidebar">
          <section className="side-card prompt-card"><p className="mini-label">QUICK STARTS</p><h2>What shall we tackle?</h2>{starters.map((starter) => <button type="button" key={starter} onClick={() => setInput(starter)}><span>✦</span>{starter}<i>→</i></button>)}</section>
          <section className="side-card context-card"><span className="context-orbit" aria-hidden="true" /><p className="mini-label">WORKSPACE CONTEXT</p><h2>I&apos;m caught up.</h2><p>12 customers · 3 active leads · 7 open tasks</p><small>Last synced just now</small></section>
        </aside>
      </div>
    </Layout>
  )
}
