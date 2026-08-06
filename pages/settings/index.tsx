import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'

type Settings = {
  tenant: { name: string; domain?: string } | null
  subscription: {
    planName: string
    priceCents: number
    currency: string
    status: string
    currentPeriodEnd?: string
  } | null
  user: { name?: string; email: string; role: string }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => setSettings(d))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      {loading && <div className="text-sm text-gray-600">Loading…</div>}
      {settings && (
        <div className="grid gap-4 max-w-2xl">
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2">Business</h3>
            <div className="text-sm text-gray-600">{settings.tenant?.name}</div>
            <div className="text-sm text-gray-600">{settings.tenant?.domain || 'No domain set'}</div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2">Account</h3>
            <div className="text-sm text-gray-600">{settings.user.name || settings.user.email}</div>
            <div className="text-sm text-gray-600 mb-3">{settings.user.email} • {settings.user.role}</div>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="text-sm px-3 py-1 border rounded text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2">Billing</h3>
            {settings.subscription ? (
              <>
                <div className="text-sm text-gray-600">
                  {settings.subscription.planName} plan • R{(settings.subscription.priceCents / 100).toLocaleString('en-ZA')}/month
                </div>
                <div className="text-sm text-gray-600 mb-3">Status: {settings.subscription.status}</div>
              </>
            ) : (
              <div className="text-sm text-gray-600 mb-3">No active subscription.</div>
            )}
            <button
              disabled
              title="Payment provider not connected yet"
              className="text-sm px-3 py-1 border rounded text-gray-400 cursor-not-allowed"
            >
              Manage billing
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}
