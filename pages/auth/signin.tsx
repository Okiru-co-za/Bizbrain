import { getCsrfToken, signIn } from 'next-auth/react'
import { useState } from 'react'
import Layout from '../../components/Layout'

export default function SignIn({ csrfToken }: { csrfToken: string }) {
  const [email, setEmail] = useState('')

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <p className="text-sm text-gray-600 mb-3">Enter your email to sign in (development mode).</p>
        <form onSubmit={(e) => { e.preventDefault(); signIn('credentials', { email }) }}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <label className="block text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded mb-3" />
          <button className="w-full py-2 bg-blue-600 text-white rounded">Sign in</button>
        </form>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  const token = await getCsrfToken(context)
  return { props: { csrfToken: token } }
}
