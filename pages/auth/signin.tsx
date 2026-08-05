import Head from 'next/head'
import Image from 'next/image'
import { getCsrfToken, signIn } from 'next-auth/react'
import { FormEvent, useState } from 'react'

export default function SignIn({ csrfToken }: { csrfToken: string }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await signIn('credentials', {
        email,
        csrfToken,
        redirect: false,
        callbackUrl: '/'
      })

      if (result?.error) {
        setError('We could not sign you in. Check your email and try again.')
        return
      }

      if (result?.url) {
        window.location.href = result.url
        return
      }

      if (result?.ok) {
        window.location.href = '/'
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Sign in | BizBrain</title>
        <meta
          name="description"
          content="Sign in to BizBrain, your AI-powered business operations workspace."
        />
      </Head>

      <main className="signin-shell">
        <section className="signin-panel" aria-labelledby="signin-title">
          <a className="brand-lockup" href="/" aria-label="BizBrain home">
            <span className="brand-mark" aria-hidden="true">
              <span />
            </span>
            <span>BizBrain</span>
          </a>

          <div className="signin-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Your business, in one place
            </div>

            <h1 id="signin-title">Welcome back, boss.</h1>
            <p className="signin-intro">
              The calmer way to manage customers, tasks and the next big thing.
            </p>

            <form className="signin-form" onSubmit={handleSubmit}>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

              {error && (
                <p className="signin-error" role="alert">
                  {error}
                </p>
              )}

              <label htmlFor="email">Work email</label>
              <div className="email-field">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6.75h16v10.5H4z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m4.5 7.5 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@yourbusiness.co.za"
                  autoComplete="email"
                  required
                  autoFocus
                />
              </div>

              <button type="submit" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Opening your workspace…' : 'Continue to workspace'}</span>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h13m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            <p className="signin-note">One workspace for your team and your business.</p>
          </div>

          <p className="signin-footer">Built for small businesses with big plans.</p>
        </section>

        <section className="signin-visual" aria-label="A business owner managing her day">
          <Image
            src="/auth/bizbrain-login-hero.png"
            alt="A confident business owner working at her laptop while speaking on a pink telephone"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 56vw"
            className="signin-portrait"
          />

          <div className="visual-wash" aria-hidden="true" />
          <div className="visual-pattern" aria-hidden="true" />
          <div className="visual-flower" aria-hidden="true">
            <span /><span /><span /><span />
          </div>

          <div className="visual-copy">
            <p>Make moves.<br />We&apos;ll handle the admin.</p>
            <span>CRM · OPERATIONS · AI ASSISTANT</span>
          </div>

          <div className="status-card">
            <span className="status-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m7.5 12.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span><strong>Today is under control</strong>3 priorities ready for you</span>
          </div>
        </section>
      </main>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const token = await getCsrfToken(context)
  return { props: { csrfToken: token } }
}
