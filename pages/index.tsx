import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const WHATSAPP_URL = 'https://wa.me/27781046527?text=Hi%20Okiru%2C%20I%27m%20interested%20in%20BizBrain.%20Can%20you%20tell%20me%20more%3F'

const tourData = {
  Leads: {
    label: 'Lead momentum', value: '14', unit: 'warm leads this month', stats: [['New', '18'], ['Contacted', '14'], ['Qualified', '9'], ['Won', '5']], note: 'Know who needs a follow-up before an opportunity goes cold.'
  },
  Invoicing: {
    label: 'Cash in motion', value: 'R42k', unit: 'invoiced this month', stats: [['Drafts', '3'], ['Sent', '12'], ['Paid', '9'], ['Overdue', '3']], note: 'Draft, send and track invoices without chasing another spreadsheet.'
  },
  Bookings: {
    label: 'Booking conversion', value: '75%', unit: 'of requests converted to paid', stats: [['Requests', '24'], ['Approved', '22'], ['Paid', '18'], ['Overdue', '4']], note: 'Turn booking requests into paid work, without the endless back-and-forth.'
  },
  Social: {
    label: 'Content rhythm', value: '8', unit: 'posts ready to publish', stats: [['Ideas', '16'], ['Drafted', '8'], ['Scheduled', '6'], ['Live', '12']], note: 'Stay visible with content shaped around your real business activity.'
  },
  'AI insights': {
    label: 'Next best move', value: '3', unit: 'priority actions identified', stats: [['Leads', '3'], ['Quotes', '2'], ['Replies', '4'], ['Risks', '1']], note: 'BizBrain learns the patterns and brings the useful decisions to the surface.'
  }
}

const industries = [
  { type: 'Beauty & salons', brand: 'Lumière', line: 'Glow that books itself.', detail: 'Bookings, reminders and a feed that keeps your chair full.', tone: 'pink' },
  { type: 'Events & experiences', brand: 'Noir&Co', line: 'Unforgettable, sold out.', detail: 'Ticketing, RSVPs and a site that sells the vibe.', tone: 'maroon' },
  { type: 'Food & catering', brand: 'Feast', line: 'Fully booked weekends.', detail: 'Quotes, menus and orders, without the WhatsApp chaos.', tone: 'wood' },
  { type: 'Fitness & coaching', brand: 'RISE', line: 'Clients who show up.', detail: 'Sign-ups, packages and check-ins on autopilot.', tone: 'green' }
]

const faqs = [
  ['I have an idea but do not know where to start.', 'That is exactly what the discovery call is for. We turn the idea into a practical website, workflow and launch plan around your real business.'],
  ['I am not techy at all. Will I cope?', 'Yes. We set everything up, keep the experience simple and teach you how to use your BizBrain. You do not need to become a software expert.'],
  ['What do I actually get for R999 a month?', 'A customised website, business email and domain setup assistance, maintenance, CRM, invoicing, bookings, accounting workflows, AI insights, analytics and social setup.'],
  ['Do I pay R999 a month forever?', 'No. After 24 consecutive months on the base package, your BizBrain is yours to own outright with no further subscription for the included build.'],
  ['Is there a large upfront build fee?', 'Not for the base package. It is designed to remove the big upfront barrier. Larger bespoke projects are quoted clearly before work begins.'],
  ['Do you set up Google Search Console and Analytics?', 'Yes. Search Console, Google Analytics and your social media foundations are included so you can see how customers find you.'],
  ['I do not have a logo, domain or business email yet.', 'That is okay. We can help you shape the essentials and include domain and business email setup assistance.'],
  ['How is this different from Wix, QuickBooks or Zoho?', 'Those are separate tools you configure yourself. BizBrain brings your public website and the operations behind it into one custom system built around your business.'],
  ['Can I cancel anytime?', 'Yes, monthly plans are month to month. Ownership after two years applies after 24 consecutive months on the base package.'],
  ['What about my data and POPIA?', 'Your business data is kept within your dedicated workspace. During setup we map your data needs and privacy responsibilities, including practical POPIA considerations.']
]

export default function MarketingHome() {
  const [activeTour, setActiveTour] = useState<keyof typeof tourData>('Bookings')
  const currentTour = tourData[activeTour]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bizbrain-production-5ef3.up.railway.app'
  const title = 'BizBrain | Your whole business, in your pocket'
  const description = 'BizBrain combines your website, CRM, invoicing, bookings, marketing, analytics and AI assistant in one custom business system for South African startups.'
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Okiru BizBrain',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description,
    url: siteUrl,
    areaServed: 'ZA',
    offers: { '@type': 'Offer', price: '999', priceCurrency: 'ZAR', billingDuration: 'P1M' },
    provider: { '@type': 'Organization', name: 'Okiru', url: 'https://www.okiru.biz/' }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="business management software South Africa, CRM for small business, invoicing software, booking system, AI business assistant, small business website South Africa" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="theme-color" content="#173f32" />
        <link rel="canonical" href={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_ZA" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={`${siteUrl}/auth/bizbrain-login-hero.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}/auth/bizbrain-login-hero.png`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <div className="marketing-site">
        <header className="marketing-header">
          <div className="marketing-container marketing-nav">
            <a href="#top" className="marketing-brand" aria-label="BizBrain home">
              <span className="marketing-brand-mark" aria-hidden="true"><i /><i /><i /></span>
              <span>BizBrain</span>
            </a>
            <nav aria-label="Marketing navigation">
              <a href="#product">Product</a>
              <a href="#growth">Growth</a>
              <a href="#process">How it works</a>
              <a href="#industries">Industries</a>
              <a href="#pricing">Pricing</a>
            </nav>
            <div className="marketing-nav-actions">
              <Link href="/auth/signin">Sign in</Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="marketing-nav-cta">Book a demo <span>↗</span></a>
            </div>
          </div>
        </header>

        <main id="top">
          <section className="marketing-hero">
            <div className="marketing-container hero-grid">
              <div className="hero-copy">
                <div className="marketing-eyebrow"><span>✦</span> Website + operations + AI, together</div>
                <h1>Your whole business, <em>in your pocket.</em></h1>
                <p>Not another collection of tools. BizBrain brings your website, customers, bookings, invoicing, marketing and live insights into one app that learns how your business works.</p>
                <div className="hero-actions">
                  <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="marketing-button primary">Book a demo <span>→</span></a>
                  <a href="#product" className="marketing-button secondary">See it in action <span>↓</span></a>
                </div>
                <div className="hero-proof"><span className="proof-avatars"><i>W</i><i>B</i><i>SA</i></span><p><strong>Built for South African founders</strong><small>Custom to your brand. Simple enough for your phone.</small></p></div>
              </div>

              <div className="hero-editorial">
                <div className="hero-photo-wrap">
                  <Image src="/auth/bizbrain-login-hero.png" alt="A composed business owner calmly directing several work demands" fill priority sizes="(max-width: 900px) 100vw, 48vw" className="marketing-hero-photo" />
                  <div className="hero-photo-wash" aria-hidden="true" />
                </div>
                <div className="hero-float-card hero-float-top"><span>✦</span><p><small>AI priority</small><strong>Follow up with 3 warm leads</strong></p></div>
                <div className="hero-float-card hero-float-bottom"><p><small>Pipeline this month</small><strong>R68,000</strong></p><span className="float-trend">↗ 12%</span></div>
                <div className="hero-orbit" aria-hidden="true" />
              </div>
            </div>
          </section>

          <section className="value-ribbon" aria-label="BizBrain capabilities">
            <div className="marketing-container">
              {['Your website', 'CRM', 'Invoicing', 'Bookings', 'Social media', 'Live analytics', 'AI assistant'].map((item, index) => <span key={item}>{index > 0 && <i>✦</i>}{item}</span>)}
            </div>
          </section>

          <section className="marketing-section product-tour" id="product">
            <div className="marketing-container">
              <div className="section-heading split"><div><p className="section-kicker">LIVE DASHBOARD TOUR</p><h2>Everything you track.<br /><em>One clear view.</em></h2></div><p>Your BizBrain is custom built around the work you actually do. Tap through a sample workspace below.</p></div>
              <div className="tour-shell">
                <div className="tour-tabs" role="tablist" aria-label="Dashboard examples">
                  {(Object.keys(tourData) as Array<keyof typeof tourData>).map((tab) => <button type="button" role="tab" aria-selected={activeTour === tab} className={activeTour === tab ? 'active' : ''} onClick={() => setActiveTour(tab)} key={tab}>{tab}{activeTour === tab && <span />}</button>)}
                </div>
                <div className="tour-dashboard">
                  <div className="tour-sidebar" aria-hidden="true"><span className="tour-logo">B</span>{[1,2,3,4,5,6].map((item) => <i className={item === 3 ? 'active' : ''} key={item} />)}</div>
                  <div className="tour-content">
                    <div className="tour-topline"><div><small>{activeTour}</small><strong>{currentTour.label}</strong></div><span><i /> Live</span></div>
                    <div className="tour-metric"><strong>{currentTour.value}</strong><span>{currentTour.unit}</span><svg viewBox="0 0 300 74" preserveAspectRatio="none" aria-hidden="true"><path d="M0 62 C30 58 42 48 65 51 S102 28 130 36 S170 44 192 22 S240 17 300 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /><path d="M0 62 C30 58 42 48 65 51 S102 28 130 36 S170 44 192 22 S240 17 300 5 L300 74 L0 74Z" fill="currentColor" opacity=".08" /></svg></div>
                    <div className="tour-stat-grid">{currentTour.stats.map(([label, value], index) => <div key={label}><span className={`tour-stat-icon stat-${index}`}>{index % 2 ? '↗' : '•'}</span><small>{label}</small><strong>{value}</strong></div>)}</div>
                    <p className="tour-note"><span>Why it matters</span>{currentTour.note}</p>
                  </div>
                </div>
              </div>
              <p className="illustrative-note">Illustrative data. Your BizBrain is custom built around your business.</p>
            </div>
          </section>

          <section className="marketing-section text-workflow">
            <div className="marketing-container workflow-grid">
              <div className="workflow-copy"><p className="section-kicker">AS EASY AS SENDING A TEXT</p><h2>No spreadsheets.<br /><em>Just say what you need.</em></h2><p>Bookings and payments do not live in a spreadsheet anymore. You ask, BizBrain drafts it, you tap approve, done.</p><blockquote>“You stay in control. BizBrain does the work.”</blockquote></div>
              <div className="workflow-phone">
                <div className="phone-top"><span>9:41</span><strong>BizBrain</strong><i>•••</i></div>
                <div className="phone-day">Today</div>
                {['Draft an email to Thandi', 'Set up a meeting Tuesday', 'Send Naledi her invoice', 'Collect the deposit'].map((item, index) => <div className="approval-message" key={item}><div><span>✦</span><p>{item}</p></div><button type="button"><span>✓</span> Approve</button>{index < 3 && <small>{['09:14', '09:18', '09:26'][index]}</small>}</div>)}
                <div className="phone-input">Ask BizBrain… <span>↑</span></div>
              </div>
            </div>
          </section>

          <section className="marketing-section growth-section" id="growth">
            <div className="marketing-container">
              <div className="section-heading centered"><p className="section-kicker">MORE THAN ADMIN</p><h2>It does not just organise your business.<br /><em>It helps grow it.</em></h2><p>Your growth engine is built in, so getting found and winning customers is not another agency bill.</p></div>
              <div className="growth-grid">
                <article><span className="growth-number">01</span><div className="growth-icon">⌁</div><h3>Search Console & Analytics</h3><p>We connect the tools from day one, so you can see who finds your business and how.</p></article>
                <article><span className="growth-number">02</span><div className="growth-icon pink">◎</div><h3>Social, set up and taught</h3><p>Your accounts go live and connect to BizBrain, with practical guidance on what to post.</p></article>
                <article><span className="growth-number">03</span><div className="growth-icon wood">↗</div><h3>Google optimisation</h3><p>Your site, listings and content are tuned to climb the rankings without a monthly agency retainer.</p></article>
                <article><span className="growth-number">04</span><div className="growth-icon maroon">✦</div><h3>AI optimisation</h3><p>AI learns the business and sharpens content, timing and follow-ups month after month.</p></article>
              </div>
            </div>
          </section>

          <section className="marketing-section process-section" id="process">
            <div className="marketing-container process-grid">
              <div className="process-intro"><p className="section-kicker">HOW WE WORK TOGETHER</p><h2>From first call to a business that <em>runs lighter.</em></h2><p>A guided process, with the setup and teaching included.</p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Start the conversation <span>→</span></a></div>
              <ol className="process-list">
                <li><span>01</span><div><h3>Discovery call</h3><p>An alignment meeting to capture your business, vision and how you want it all to feel.</p></div></li>
                <li><span>02</span><div><h3>Your tailored site</h3><p>We build the public website that captures your brand and connects to everything behind it.</p></div></li>
                <li><span>03</span><div><h3>Functions that think</h3><p>Real-time tools work ahead of you—a partner, not another app that needs managing.</p></div></li>
                <li><span>04</span><div><h3>Set up and taught</h3><p>Analytics, Search Console and social are connected, and you learn how to use your assistant.</p></div></li>
              </ol>
            </div>
          </section>

          <section className="marketing-section industries-section" id="industries">
            <div className="marketing-container">
              <div className="section-heading split"><div><p className="section-kicker">BUILT FOR YOUR INDUSTRY</p><h2>Your look and feel.<br /><em>Never a generic template.</em></h2></div><p>Every BizBrain is shaped around the way your industry wins customers and delivers work.</p></div>
              <div className="industry-grid">{industries.map((industry) => <article className={`industry-card ${industry.tone}`} key={industry.type}><div className="industry-browser"><span><i /><i /><i /></span><small>yourbusiness.co.za</small></div><div className="industry-preview"><p>{industry.type}</p><strong>{industry.brand}</strong><h3>{industry.line}</h3><button type="button">Explore <span>↗</span></button><div className="industry-shape" aria-hidden="true" /></div><div className="industry-caption"><strong>{industry.type}</strong><p>{industry.detail}</p></div></article>)}</div>
            </div>
          </section>

          <section className="marketing-section case-study">
            <div className="marketing-container case-shell">
              <div className="case-copy"><p className="section-kicker">CASE STUDY</p><h2>Woman of Taste<br /><em>runs on BizBrain.</em></h2><p>A South African events business moved from WhatsApp, spreadsheets and spare-time posting to one connected site and admin system.</p><a href="https://womanoftaste.co.za/" target="_blank" rel="noreferrer">Visit Woman of Taste <span>↗</span></a></div>
              <div className="case-stats"><div><strong>R15 600</strong><span>collected from one event</span></div><div><strong>24</strong><span>tickets sold</span></div><div><strong>75%</strong><span>requests converted to paid</span></div><div><strong>1 place</strong><span>for the whole operation</span></div></div>
            </div>
          </section>

          <section className="marketing-section pricing-section" id="pricing">
            <div className="marketing-container">
              <div className="section-heading centered"><p className="section-kicker">PRICING</p><h2>One clear starting point.<br /><em>Everything essential included.</em></h2></div>
              <div className="pricing-grid">
                <article className="price-card main"><div className="price-badge">START HERE</div><p>Base package</p><h3>R999<small>/month</small></h3><span>Everything to launch and run your business online.</span><ul>{['Set-up assistance, done for you', 'Website customised to your brand', 'Domain and business email setup', 'CRM, invoicing, bookings and AI insights', 'Analytics, Search Console and social setup', 'Ongoing maintenance and updates', 'Yours outright after 24 consecutive months'].map((item) => <li key={item}><i>✓</i>{item}</li>)}</ul><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="marketing-button primary">Book a demo <span>→</span></a></article>
                <article className="price-card"><p>Top-up credits</p><h3>R100<small>/bundle</small></h3><span>1,000 credits for additions and design changes.</span><ul><li><i>✓</i>Full page addition or redo</li><li><i>✓</i>New features or design changes</li><li><i>✓</i>No commitment—top up when needed</li></ul><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Add credits <span>→</span></a></article>
                <article className="price-card"><p>Major builds</p><h3>Quoted</h3><span>Clear pricing for larger custom projects.</span><ul><li><i>✓</i>Complex or multi-site builds</li><li><i>✓</i>Large custom features</li><li><i>✓</i>Integrations and bespoke work</li></ul><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Request a quote <span>→</span></a></article>
              </div>
              <p className="pricing-footnote"><strong>Win one new client a month and it has paid for itself.</strong> No big upfront build, no surprise bills, and it is yours after two years on the base package.</p>
            </div>
          </section>

          <section className="marketing-section faq-section" id="questions">
            <div className="marketing-container faq-grid"><div className="faq-intro"><p className="section-kicker">QUESTIONS</p><h2>Starting out?<br /><em>Start here.</em></h2><p>The practical answers founders usually need before taking the next step.</p></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>＋</span></summary><p>{answer}</p></details>)}</div></div>
          </section>

          <section className="final-cta">
            <div className="marketing-container final-cta-inner"><div className="cta-flower" aria-hidden="true"><i /><i /><i /><i /></div><p className="section-kicker">YOUR BUSINESS, BUT LIGHTER</p><h2>Spend your time on the business.<br /><em>Not the admin.</em></h2><p>Bring your website, customers, money and marketing into one BizBrain built around your company.</p><div className="hero-actions"><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="marketing-button light">Book a demo <span>→</span></a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="marketing-button outline-light">WhatsApp us <span>↗</span></a></div></div>
          </section>
        </main>

        <footer className="marketing-footer">
          <div className="marketing-container footer-grid"><div><a href="#top" className="marketing-brand"><span className="marketing-brand-mark" aria-hidden="true"><i /><i /><i /></span><span>BizBrain</span></a><p>Your whole business, in your pocket. Built and supported by Okiru in South Africa.</p></div><div><strong>Explore</strong><a href="#product">Product</a><a href="#growth">Growth</a><a href="#pricing">Pricing</a><a href="#questions">Questions</a></div><div><strong>Okiru</strong><a href="https://www.okiru.biz/toolkit/" target="_blank" rel="noreferrer">AI Tool Advisor ↗</a><a href="https://www.okiru.biz/tools/" target="_blank" rel="noreferrer">All tools ↗</a><a href="https://www.okiru.biz/blog/" target="_blank" rel="noreferrer">Blog ↗</a></div><div><strong>Workspace</strong><Link href="/auth/signin">Sign in</Link><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp us ↗</a></div></div>
          <div className="marketing-container footer-bottom"><span>© {new Date().getFullYear()} Okiru BizBrain</span><span>Custom built for your company and brand. Cancel anytime on monthly plans.</span></div>
        </footer>
      </div>
    </>
  )
}
