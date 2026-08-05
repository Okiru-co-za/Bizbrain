import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'

const priorities = [
  { title: 'Follow up with new leads', detail: '3 contacts waiting', tone: 'pink', time: 'Today' },
  { title: 'Review quotation drafts', detail: '2 ready for approval', tone: 'green', time: '10:30' },
  { title: 'Reply to customer request', detail: 'Tumi at Mokoena Studio', tone: 'maroon', time: '12:00' }
]

const activity = [
  { initials: 'NM', name: 'Naledi Media', action: 'accepted a quotation', value: 'R18,500', time: '18m' },
  { initials: 'TK', name: 'Thabo Kitchens', action: 'moved to negotiation', value: 'R24,000', time: '1h' },
  { initials: 'LS', name: 'Lerato Studio', action: 'became a new lead', value: 'New', time: '3h' }
]

export default function Dashboard() {
  return (
    <Layout>
      <Head><title>Dashboard | BizBrain</title></Head>

      <div className="page-heading dashboard-heading">
        <div>
          <p className="page-kicker"><span /> Wednesday · Your daily view</p>
          <h1>Good morning. <em>Let&apos;s make moves.</em></h1>
          <p>Here&apos;s the useful stuff—nothing more, nothing less.</p>
        </div>
        <Link href="/assistant" className="button-primary"><span className="button-spark">✦</span> Ask BizBrain</Link>
      </div>

      <section className="metric-grid" aria-label="Business summary">
        <article className="metric-card featured">
          <div className="metric-top"><span className="metric-icon">R</span><span className="trend up">↗ 12%</span></div>
          <p>Pipeline value</p><strong>R68,000</strong><small>Across 4 opportunities</small>
          <div className="metric-scribble" aria-hidden="true" />
        </article>
        <article className="metric-card">
          <div className="metric-top"><span className="metric-icon pink">◎</span><span className="trend">This week</span></div>
          <p>Active leads</p><strong>12</strong><small>3 need a follow-up</small>
        </article>
        <article className="metric-card">
          <div className="metric-top"><span className="metric-icon wood">✓</span><span className="trend">Today</span></div>
          <p>Open tasks</p><strong>7</strong><small>2 due before lunch</small>
        </article>
        <article className="metric-card">
          <div className="metric-top"><span className="metric-icon maroon">%</span><span className="trend up">↗ 4%</span></div>
          <p>Quote win rate</p><strong>25%</strong><small>2 of 8 accepted</small>
        </article>
      </section>

      <div className="dashboard-grid">
        <section className="panel priority-panel">
          <div className="panel-heading">
            <div><p className="mini-label">FOCUS FIRST</p><h2>Today&apos;s priorities</h2></div>
            <Link href="/tasks">View all <span>→</span></Link>
          </div>
          <div className="priority-list">
            {priorities.map((item, index) => (
              <div className="priority-row" key={item.title}>
                <button type="button" className={`priority-check ${item.tone}`} aria-label={`Mark ${item.title} complete`}><span /></button>
                <div><strong>{item.title}</strong><small>{item.detail}</small></div>
                <time>{item.time}</time>
                <span className="row-arrow">›</span>
              </div>
            ))}
          </div>
          <p className="priority-note"><span>3</span> clear actions will move the business forward today.</p>
        </section>

        <aside className="assistant-brief">
          <div className="brief-pattern" aria-hidden="true" />
          <div className="brief-badge">✦</div>
          <p className="mini-label">BIZBRAIN BRIEFING</p>
          <h2>You&apos;re closer than you think.</h2>
          <p>Following up with Naledi Media could unlock your next R18,500. I&apos;ve drafted a friendly check-in for you.</p>
          <Link href="/assistant" className="brief-link">Review the draft <span>→</span></Link>
          <div className="brief-flower" aria-hidden="true"><i /><i /><i /><i /></div>
        </aside>
      </div>

      <div className="dashboard-lower">
        <section className="panel pipeline-panel">
          <div className="panel-heading"><div><p className="mini-label">MOMENTUM</p><h2>Pipeline at a glance</h2></div><span className="period-pill">Last 6 months</span></div>
          <div className="chart-wrap">
            <div className="chart-scale"><span>80k</span><span>40k</span><span>0</span></div>
            <div className="bar-chart" aria-label="Pipeline value over six months">
              {[32, 45, 38, 62, 55, 78].map((height, index) => <div className={index === 5 ? 'chart-column current' : 'chart-column'} key={index}><span style={{ height: `${height}%` }} /><small>{['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][index]}</small></div>)}
            </div>
          </div>
        </section>

        <section className="panel activity-panel">
          <div className="panel-heading"><div><p className="mini-label">JUST IN</p><h2>Recent activity</h2></div><button type="button" aria-label="More activity options">•••</button></div>
          <div className="activity-list">
            {activity.map((item, index) => (
              <div className="activity-row" key={item.name}>
                <span className={`activity-avatar avatar-${index}`}>{item.initials}</span>
                <div><strong>{item.name}</strong><small>{item.action}</small></div>
                <span className="activity-value">{item.value}</span><time>{item.time}</time>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}
