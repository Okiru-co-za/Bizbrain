import Link from 'next/link'

export default function Nav() {
  const items = [
    { href: '/', label: 'Home' },
    { href: '/assistant', label: 'Assistant' },
    { href: '/customers', label: 'Customers' },
    { href: '/leads', label: 'Leads' },
    { href: '/opportunities', label: 'Opportunities' },
    { href: '/quotes', label: 'Quotes' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/inbox', label: 'Inbox' },
    { href: '/documents', label: 'Documents' },
    { href: '/reports', label: 'Reports' },
    { href: '/website', label: 'Website' },
    { href: '/settings', label: 'Settings' }
  ]

  return (
    <nav className="bg-white border-b">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-4">
          <div className="font-semibold text-lg">BizBrain</div>
          <div className="hidden md:flex space-x-2">
            {items.slice(0, 6).map((it) => (
              <Link key={it.href} href={it.href} className="text-sm text-gray-600 hover:text-gray-900">
                {it.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/settings" className="text-sm text-gray-600">Settings</Link>
        </div>
      </div>
    </nav>
  )
}
