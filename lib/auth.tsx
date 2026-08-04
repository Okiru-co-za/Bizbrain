import React, { createContext, useContext, useState, ReactNode } from 'react'

type User = {
  id: string
  email: string
  name?: string
  tenantId?: string
  role?: string
}

type AuthContextValue = {
  user: User | null
  signIn: (email: string) => Promise<User>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  async function signIn(email: string) {
    // Use NextAuth signIn for production-like flows
    const res = await fetch('/api/auth/mock-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setUser(data.user)
    return data.user
  }

  function signOut() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
