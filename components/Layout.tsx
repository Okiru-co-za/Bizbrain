import { ReactNode } from 'react'
import Nav from './Nav'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Nav />
      <div className="app-frame">
        <main className="app-main">
          <div className="app-shape app-shape-pink" aria-hidden="true" />
          <div className="app-shape app-shape-wood" aria-hidden="true" />
          <div className="app-content">{children}</div>
        </main>
      </div>
    </div>
  )
}
