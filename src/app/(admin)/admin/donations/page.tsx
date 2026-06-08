'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'

interface Donation {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  amount: number
  payment_method: string
  payment_ref: string
  status: string
  created_at: string
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [filtered, setFiltered] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const {toggleSidebar } = useSidebar();

  useEffect(() => {
    async function fetchDonations() {
      const res = await fetch('/api/admin/donations')
      const data = await res.json()
      setDonations(data.donations)
      setFiltered(data.donations)
      setLoading(false)
    }
    fetchDonations()
  }, [])

  useEffect(() => {
    let result = donations
    if (statusFilter !== 'all') {
      result = result.filter(d => d.status === statusFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(d =>
        `${d.first_name} ${d.last_name}`.toLowerCase().includes(q) ||
        d.email?.toLowerCase().includes(q) ||
        d.payment_ref?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, donations])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/donations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setDonations(prev => prev.map(d => d.id === id ? { ...d, status } : d))
  }

  const totalAmount = filtered
    .filter(d => d.status === 'successful')
    .reduce((sum, d) => sum + Number(d.amount), 0)

  const STATUS_TABS = ['all', 'pending', 'successful', 'failed']

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
            <h1 className="font-heading text-4xl text-[#01381d]">DONATIONS</h1>
            <p className="text-ink-muted text-sm mt-1">Track and manage all campaign donations.</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
      </div>


      {/* Total raised */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-[#01381d] rounded-xl flex items-center justify-center text-lg">💰</div>
              <span className="font-heading text-2xl text-[#01381d]">
                ₦{totalAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-sm font-semibold text-ink-muted">Total Raised</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-[#f97316] rounded-xl flex items-center justify-center text-lg">⏳</div>
              <span className="font-heading text-2xl text-[#01381d]">
                {donations.filter(d => d.status === 'pending').length}
              </span>
            </div>
            <p className="text-sm font-semibold text-ink-muted">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-[#015b2d] rounded-xl flex items-center justify-center text-lg">✅</div>
              <span className="font-heading text-2xl text-[#01381d]">
                {donations.filter(d => d.status === 'successful').length}
              </span>
            </div>
            <p className="text-sm font-semibold text-ink-muted">Successful</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="font-heading text-xl text-[#01381d]">
              ALL DONATIONS <span className="text-ink-muted font-sans text-sm font-normal">({filtered.length})</span>
            </CardTitle>
            <Input
              placeholder="Search by name, email, reference..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="field sm:w-72"
            />
          </div>

          {/* Status tabs */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {STATUS_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  statusFilter === tab
                    ? 'bg-[#01381d] text-white'
                    : 'bg-gray-100 text-ink-muted hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-ink-muted text-sm text-center py-12">No donations found.</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm min-w-[900px]">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Email</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Phone</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Method</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Reference</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 font-semibold whitespace-nowrap">{d.first_name} {d.last_name}</td>
                      <td className="py-3 px-2 text-ink-muted">{d.email}</td>
                      <td className="py-3 px-2 text-ink-muted whitespace-nowrap">{d.phone}</td>
                      <td className="py-3 px-2 font-bold text-[#01381d] whitespace-nowrap">
                        ₦{Number(d.amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-ink-muted capitalize">
                          {d.payment_method}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-ink-muted font-mono text-xs">{d.payment_ref ?? '—'}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          d.status === 'successful' ? 'bg-green-100 text-green-700' :
                          d.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-ink-muted whitespace-nowrap">
                        {new Date(d.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          {d.status !== 'successful' && (
                            <button
                              onClick={() => updateStatus(d.id, 'successful')}
                              className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors"
                            >
                              Confirm
                            </button>
                          )}
                          {d.status !== 'failed' && (
                            <button
                              onClick={() => updateStatus(d.id, 'failed')}
                              className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}