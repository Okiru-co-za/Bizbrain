import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import Layout from '../../components/Layout'

type Customer = { id: string; name: string; businessName?: string; phone?: string; email?: string }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/customers')
      .then((response) => {
        if (!response.ok) throw new Error('Request failed')
        return response.json()
      })
      .then((data) => setCustomers(data.customers || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const filteredCustomers = useMemo(() => {
    const term = query.toLowerCase().trim()
    if (!term) return customers
    return customers.filter((customer) => [customer.name, customer.businessName, customer.email, customer.phone].some((value) => value?.toLowerCase().includes(term)))
  }, [customers, query])

  return (
    <Layout>
      <Head><title>Customers | BizBrain</title></Head>
      <div className="page-heading customers-heading">
        <div><p className="page-kicker"><span /> Relationships that matter</p><h1>Customers</h1><p>Every conversation, detail and next step—kept together.</p></div>
        <div className="customer-count"><strong>{customers.length}</strong><span>total customers</span></div>
      </div>

      <section className="customer-panel panel">
        <div className="customer-toolbar">
          <label className="search-field"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.7" /><path d="m15.5 15.5 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers…" aria-label="Search customers" /></label>
          <div className="filter-pills"><button className="active" type="button">All</button><button type="button">Active</button><button type="button">Needs attention</button></div>
        </div>

        <div className="customer-table" role="table" aria-label="Customers">
          <div className="customer-table-head" role="row"><span>Customer</span><span>Contact</span><span>Status</span><span>Last activity</span><span /></div>
          {loading && <div className="customer-state"><span className="loading-orbit" /><strong>Gathering your customers…</strong></div>}
          {error && <div className="customer-state error"><strong>We couldn&apos;t load customers.</strong><span>Refresh the page to try again.</span></div>}
          {!loading && !error && filteredCustomers.map((customer, index) => {
            const displayName = customer.businessName || customer.name
            const initials = displayName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
            return (
              <div className="customer-row" role="row" key={customer.id}>
                <div className="customer-name"><span className={`customer-avatar customer-${index % 4}`}>{initials}</span><div><strong>{displayName}</strong><small>{customer.businessName ? customer.name : 'Individual customer'}</small></div></div>
                <div className="customer-contact"><span>{customer.email || 'No email yet'}</span><small>{customer.phone || 'No phone yet'}</small></div>
                <span className="status-pill"><i /> Active</span><span className="last-active">Recently</span><button className="open-customer" type="button" aria-label={`Open ${displayName}`}>→</button>
              </div>
            )
          })}
          {!loading && !error && filteredCustomers.length === 0 && <div className="customer-state"><span className="empty-flower">✦</span><strong>{query ? 'No customers match that search.' : 'Your customer list is ready for its first name.'}</strong><span>{query ? 'Try a different name, email or phone number.' : 'New customers will appear here as they are added.'}</span></div>}
        </div>
      </section>
    </Layout>
  )
}
