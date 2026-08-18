'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import Link from 'next/link'
import * as XLSX from 'xlsx'

interface YouthMember {
  id: string
  member_id: string
  full_name: string
  email: string
  phone: string
  lga: string
  ward: string
  occupation: string
  status: string
  created_at: string
}

export default function AdminYouthCouncilPage() {
  const [members, setMembers] = useState<YouthMember[]>([])
  const [filtered, setFiltered] = useState<YouthMember[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { toggleSidebar } = useSidebar()

  function exportToExcel() {
    const exportData = filtered.map(m => ({
      'Member ID': m.member_id,
      'Full Name': m.full_name,
      'LGA': m.lga,
      'Ward': m.ward,
      'Email': m.email,
      'Phone': m.phone,
      'Occupation': m.occupation,
      'Date Registered': new Date(m.created_at).toLocaleDateString('en-GB'),
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Youth Council')
    XLSX.writeFile(workbook, `MAI-Youth-Council-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  useEffect(() => {
    async function fetchMembers() {
      const res = await fetch('/api/admin/youth-council')
      const data = await res.json()
      setMembers(data.members || [])
      setFiltered(data.members || [])
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
        m.member_id?.toLowerCase().includes(q) ||
        m.lga?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, members])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/youth-council', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m))
    toast.success(`Member ${status}.`)
  }

  async function approveAll() {
    const res = await fetch('/api/admin/youth-council', {
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

  const STATUS_TABS = ['all', 'pending', 'approved', 'rejected']

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-[#01381d]">YOUTH COUNCIL</h1>
          <p className="text-ink-muted text-sm mt-1">Manage registered youth council members</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <Card>
        <CardHeader>
          {/* Responsive Flex Container */}
          <div className="flex flex-col gap-4 justify-between">
            <CardTitle className="font-heading text-xl text-[#01381d]">
              ALL MEMBERS <span className="text-ink-muted font-sans text-sm font-normal">({filtered.length})</span>
            </CardTitle>
            
            {/* Buttons and Search wrap on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <button onClick={approveAll} className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors uppercase tracking-wider whitespace-nowrap">
                ✅ Approve All Pending
              </button>
              <Input placeholder="Search by name, email, ID..." value={search} onChange={e => setSearch(e.target.value)} className="field sm:w-72" />
              <button onClick={exportToExcel} className="px-4 py-2 bg-[#01381d] text-white text-xs font-bold rounded-xl hover:bg-[#015b2d] transition-colors uppercase tracking-wider whitespace-nowrap">
                📊 Export to Excel
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            {STATUS_TABS.map(tab => (
              <button key={tab} onClick={() => setStatusFilter(tab)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${statusFilter === tab ? 'bg-[#01381d] text-white' : 'bg-gray-100 text-ink-muted hover:bg-gray-200'}`}>
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <p className="text-ink-muted text-sm text-center py-12">No members found.</p>
          ) : (
            <div className="overflow-x-auto">
              {/* min-w to prevent squishing on mobile */}
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">ID</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Email</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Phone</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">LGA</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Occupation</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(m => (
                    <tr key={m.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs text-[#f97316] font-bold whitespace-nowrap">{m.member_id}</td>
                      <td className="py-3 px-2 font-semibold whitespace-nowrap">
                        <Link href={`/admin/youth-council/${m.id}`} className="hover:text-[#f97316] transition-colors">
                          {m.full_name}
                        </Link>
                      </td>
                      <td className="py-3 px-2 text-ink-muted">{m.email}</td>
                      <td className="py-3 px-2 text-ink-muted whitespace-nowrap">{m.phone}</td>
                      <td className="py-3 px-2 text-ink-muted">{m.lga}</td>
                      <td className="py-3 px-2 text-ink-muted">{m.occupation}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${m.status === 'approved' ? 'bg-green-100 text-green-700' : m.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          {m.status !== 'approved' && (
                            <button onClick={() => updateStatus(m.id, 'approved')} className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors">Approve</button>
                          )}
                          {m.status !== 'rejected' && (
                            <button onClick={() => updateStatus(m.id, 'rejected')} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors">Reject</button>
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