import Nav from './Nav'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="container py-8">{children}</main>
    </div>
  )
}
