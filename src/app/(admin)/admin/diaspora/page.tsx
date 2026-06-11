'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'

interface DiasporaMember {
  id: string
  diaspora_id: string
  full_name: string
  email: string
  phone: string
  country: string
  lga_origin: string
  industry: string
  status: string
  created_at: string
  photo_url: string
}

const STATUS_TABS = ['all', 'pending', 'approved', 'rejected']

export default function DiasporaPage() {
  const [members, setMembers] = useState<DiasporaMember[]>([])
  const [filtered, setFiltered] = useState<DiasporaMember[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    async function fetchMembers() {
      const res = await fetch('/api/admin/diaspora')
      const data = await res.json()
      setMembers(data.members)
      setFiltered(data.members)
      setLoading(false)
    }
    fetchMembers()
  }, [])

  useEffect(() => {
    let result = members
    if (statusFilter !== 'all') result = result.filter(m => m.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(m =>
        m.full_name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.diaspora_id?.toLowerCase().includes(q) ||
        m.country?.toLowerCase().includes(q) ||
        m.lga_origin?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, members])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/diaspora', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m))
    toast.success(`Member ${status}.`)
  }

  async function approveAll() {
    const res = await fetch('/api/admin/diaspora', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approveAll: true }),
    })
    const data = await res.json()
    if (res.ok) {
      setMembers(prev => prev.map(m => m.status === 'pending' ? { ...m, status: 'approved' } : m))
      toast.success(`${data.approved} member(s) approved successfully.`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">DIASPORA</h1>
          <p className="text-ink-muted text-sm mt-1">Manage registered diaspora network members</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="font-heading text-xl text-[#01381d]">
              ALL MEMBERS <span className="text-ink-muted font-sans text-sm font-normal">({filtered.length})</span>
            </CardTitle>
            <div className="flex gap-3 items-center">
              <button
                onClick={approveAll}
                className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors uppercase tracking-wider whitespace-nowrap"
              >
                ✅ Approve All Pending
              </button>
              <Input
                placeholder="Search by name, email, ID, country..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="field sm:w-72"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            {STATUS_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  statusFilter === tab ? 'bg-[#01381d] text-white' : 'bg-gray-100 text-ink-muted hover:bg-gray-200'
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
            <p className="text-ink-muted text-sm text-center py-12">No members found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Photo', 'ID', 'Name', 'Email', 'Country', 'LGA of Origin', 'Industry', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(m => (
                    <tr key={m.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-border">
                          {m.photo_url ? (
                            <Image src={m.photo_url} alt={m.full_name} width={40} height={40} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">👤</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs text-[#f97316] font-bold whitespace-nowrap">{m.diaspora_id}</td>
                      <td className="py-3 px-2 font-semibold whitespace-nowrap">{m.full_name}</td>
                      <td className="py-3 px-2 text-ink-muted">{m.email}</td>
                      <td className="py-3 px-2 text-ink-muted whitespace-nowrap">{m.country}</td>
                      <td className="py-3 px-2 text-ink-muted whitespace-nowrap">{m.lga_origin}</td>
                      <td className="py-3 px-2 text-ink-muted">{m.industry}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          m.status === 'approved' ? 'bg-green-100 text-green-700' :
                          m.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-ink-muted whitespace-nowrap">
                        {new Date(m.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          {m.status !== 'approved' && (
                            <button onClick={() => updateStatus(m.id, 'approved')}
                              className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors">
                              Approve
                            </button>
                          )}
                          {m.status !== 'rejected' && (
                            <button onClick={() => updateStatus(m.id, 'rejected')}
                              className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors">
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