import Link from 'next/link'
import { useRouter } from 'next/router'

type IconName = 'home' | 'spark' | 'people' | 'lead' | 'deal' | 'quote' | 'task' | 'inbox' | 'file' | 'chart' | 'invoice' | 'check' | 'settings'

const groups: Array<{ label: string; items: Array<{ href: string; label: string; icon: IconName }> }> = [
  {
    label: 'Workspace',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: 'home' },
      { href: '/assistant', label: 'AI Assistant', icon: 'spark' },
      { href: '/customers', label: 'Customers', icon: 'people' }
    ]
  },
  {
    label: 'Manage',
    items: [
      { href: '/leads', label: 'Leads', icon: 'lead' },
      { href: '/opportunities', label: 'Opportunities', icon: 'deal' },
      { href: '/quotes', label: 'Quotes', icon: 'quote' },
      { href: '/tasks', label: 'Tasks', icon: 'task' }
    ]
  },
  {
    label: 'Business',
    items: [
      { href: '/inbox', label: 'Inbox', icon: 'inbox' },
      { href: '/documents', label: 'Documents', icon: 'file' },
      { href: '/reports', label: 'Reports', icon: 'chart' },
      { href: '/invoices', label: 'Invoices', icon: 'invoice' },
      { href: '/approvals', label: 'Approvals', icon: 'check' }
    ]
  }
]

function NavIcon({ name }: { name: IconName }) {
  const common = { stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {name === 'home' && <><path d="m4 10 8-6 8 6v9H4z" {...common} /><path d="M9.5 19v-5h5v5" {...common} /></>}
      {name === 'spark' && <><path d="M12 3c.5 4.2 2.8 6.5 7 7-4.2.5-6.5 2.8-7 7-.5-4.2-2.8-6.5-7-7 4.2-.5 6.5-2.8 7-7Z" {...common} /><path d="M19 16v5M16.5 18.5h5" {...common} /></>}
      {name === 'people' && <><circle cx="9" cy="8" r="3" {...common} /><path d="M3.5 19c.4-3.5 2.2-5.2 5.5-5.2s5.1 1.7 5.5 5.2" {...common} /><path d="M15 6.2a2.8 2.8 0 0 1 0 5.4M16.2 14c2.6.3 4 2 4.3 5" {...common} /></>}
      {name === 'lead' && <><circle cx="9" cy="8" r="3" {...common} /><path d="M3.5 19c.4-3.5 2.2-5.2 5.5-5.2 1.5 0 2.7.3 3.6 1" {...common} /><path d="M17 13v6m-3-3h6" {...common} /></>}
      {name === 'deal' && <><path d="M4 8.5 8 5l4 3.5L16 5l4 3.5v8L16 20l-4-3.5L8 20l-4-3.5Z" {...common} /><path d="M12 8.5v8" {...common} /></>}
      {name === 'quote' && <><path d="M5 4h14v16H5z" {...common} /><path d="M8 8h8M8 12h8M8 16h4" {...common} /></>}
      {name === 'task' && <><path d="M9 5h11M9 12h11M9 19h11" {...common} /><path d="m3.5 5 1.3 1.3L7 4M3.5 12l1.3 1.3L7 11M3.5 19l1.3 1.3L7 18" {...common} /></>}
      {name === 'inbox' && <><path d="M4 5h16v14H4z" {...common} /><path d="m4 7 8 6 8-6" {...common} /></>}
      {name === 'file' && <><path d="M6 3h8l4 4v14H6z" {...common} /><path d="M14 3v5h4M9 12h6M9 16h6" {...common} /></>}
      {name === 'chart' && <><path d="M4 20V4M4 20h16" {...common} /><path d="m7 16 4-5 3 2 5-7" {...common} /></>}
      {name === 'invoice' && <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" {...common} /><path d="M9 8h6M9 12h6M9 16h3" {...common} /></>}
      {name === 'check' && <><circle cx="12" cy="12" r="9" {...common} /><path d="m8 12.5 2.5 2.5L16 9.5" {...common} /></>}
      {name === 'settings' && <><circle cx="12" cy="12" r="3" {...common} /><path d="M19 13.5v-3l-2-.7-.7-1.7.9-1.9-2.1-2.1-1.9.9-1.7-.7L10.5 2h-3l-.7 2.3-1.7.7-1.9-.9-2.1 2.1.9 1.9-.7 1.7-2 .7v3l2 .7.7 1.7-.9 1.9 2.1 2.1 1.9-.9 1.7.7.7 2.3h3l.7-2.3 1.7-.7 1.9.9 2.1-2.1-.9-1.9.7-1.7Z" transform="translate(2.5) scale(.8)" {...common} /></>}
    </svg>
  )
}

export default function Nav() {
  const router = useRouter()

  const isActive = (href: string) => router.pathname.startsWith(href)

  return (
    <>
      <aside className="app-sidebar">
        <Link href="/dashboard" className="app-brand" aria-label="BizBrain dashboard">
          <span className="app-brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>BizBrain</span>
        </Link>

        <button className="workspace-switcher" type="button" aria-label="Current workspace">
          <span className="workspace-avatar">BB</span>
          <span><strong>BizBrain</strong><small>Business workspace</small></span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 10 4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
        </button>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          {groups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => (
                <Link className={isActive(item.href) ? 'nav-item active' : 'nav-item'} href={item.href} key={item.href}>
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                  {item.href === '/inbox' && <em>3</em>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link className={isActive('/settings') ? 'nav-item active' : 'nav-item'} href="/settings">
            <NavIcon name="settings" /><span>Settings</span>
          </Link>
          <div className="profile-chip">
            <span>BT</span>
            <div><strong>BizBrain team</strong><small>Workspace owner</small></div>
            <i aria-hidden="true" />
          </div>
        </div>
      </aside>

      <header className="mobile-app-header">
        <Link href="/dashboard" className="app-brand"><span className="app-brand-mark" aria-hidden="true"><i /><i /><i /></span><span>BizBrain</span></Link>
        <Link href="/settings" className="mobile-settings" aria-label="Settings"><NavIcon name="settings" /></Link>
      </header>
      <nav className="mobile-tabs" aria-label="Mobile navigation">
        {groups[0].items.map((item) => (
          <Link className={isActive(item.href) ? 'active' : ''} href={item.href} key={item.href}>
            <NavIcon name={item.icon} /><span>{item.label.replace('AI ', '')}</span>
          </Link>
        ))}
        <Link className={isActive('/tasks') ? 'active' : ''} href="/tasks"><NavIcon name="task" /><span>Tasks</span></Link>
      </nav>
    </>
  )
}
