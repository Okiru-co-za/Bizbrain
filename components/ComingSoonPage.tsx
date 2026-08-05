import Link from 'next/link'
import Layout from './Layout'

export default function ComingSoonPage({ title, description }: { title: string; description: string }) {
  return (
    <Layout>
      <div className="page-heading">
        <div><p className="page-kicker">Workspace</p><h1>{title}</h1><p>{description}</p></div>
      </div>
      <section className="coming-card">
        <div className="coming-shape" aria-hidden="true"><span /><span /><span /><span /></div>
        <p className="mini-label">COMING INTO FOCUS</p>
        <h2>This space is getting the BizBrain treatment.</h2>
        <p>The foundation is ready. Your workflows and live business data will appear here as this module is connected.</p>
        <Link href="/" className="button-primary">Back to overview <span>→</span></Link>
      </section>
    </Layout>
  )
}
