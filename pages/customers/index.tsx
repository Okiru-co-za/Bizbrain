import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

type Customer = {
  id: string
  name: string
  businessName?: string
  phone?: string
  email?: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    fetch('/api/customers')
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>
      <div className="grid gap-3">
        {customers.map((c) => (
          <div key={c.id} className="bg-white p-3 rounded shadow-sm flex justify-between">
            <div>
              <div className="font-medium">{c.businessName || c.name}</div>
              <div className="text-sm text-gray-600">{c.email} • {c.phone}</div>
            </div>
            <div>
              <button className="text-sm text-blue-600">Open</button>
            </div>
          </div>
        ))}
        {customers.length === 0 && <div className="text-sm text-gray-600">No customers yet.</div>}
      </div>
    </Layout>
  )
}
