'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'

interface Volunteer {
  id: string
  volunteer_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  lga: string
  ward: string
  gender: string
  area_of_interest: string
  volunteer_areas: string[]
  status: string
  created_at: string
  photo_url: string
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [filtered, setFiltered] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const {toggleSidebar } = useSidebar();


  useEffect(() => {
    async function fetchVolunteers() {
      const res = await fetch('/api/admin/volunteers')
      const data = await res.json()
      setVolunteers(data.volunteers)
      setFiltered(data.volunteers)
      setLoading(false)
    }
    fetchVolunteers()
  }, [])

  useEffect(() => {
    let result = volunteers
    if (statusFilter !== 'all') {
      result = result.filter(v => v.status === statusFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(v =>
        `${v.first_name} ${v.last_name}`.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q) ||
        v.volunteer_id?.toLowerCase().includes(q) ||
        v.lga?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, volunteers])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/volunteers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status } : v))
  }

  async function approveAll() {
    const res = await fetch('/api/admin/volunteers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approveAll: true }),
    })
    const data = await res.json()
    if (res.ok) {
      setVolunteers(prev => prev.map(v => v.status === 'pending' ? { ...v, status: 'approved' } : v))
      toast.success(`${data.approved} volunteer(s) approved successfully.`)
    }
  }

  const STATUS_TABS = ['all', 'pending', 'approved', 'rejected']

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
             <div>
                 <h1 className="font-heading text-4xl text-[#01381d]">VOLUNTEERS</h1>
                 <p className="text-ink-muted text-sm mt-1">Manage and review all volunteer applications </p>
             </div>
             <button
                   className="lg:hidden p-2 text-gray-700"
                   onClick={toggleSidebar}
                   aria-label="Toggle menu"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                   </svg>
                 </button>
             {/* <SidebarTrigger className="flex lg:hidden font-bold text-[#015b2d] hover:bg-white/10 rounded-lg p-2 [&>svg]:w-9 [&>svg]:h-9" /> */}
             </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="font-heading text-xl text-[#01381d]">
              ALL VOLUNTEERS <span className="text-ink-muted font-sans text-sm font-normal">({filtered.length})</span>
            </CardTitle>
            <div className="flex gap-3 items-center">
              <button
                onClick={approveAll}
                className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors uppercase tracking-wider whitespace-nowrap"
              >
                ✅ Approve All Pending
              </button>
              <Input
                placeholder="Search by name, email, ID, LGA..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="field sm:w-72"
              />
            </div>
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
            <p className="text-ink-muted text-sm text-center py-12">No volunteers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm max-w-225">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Photo</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">ID</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Email</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Phone</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">LGA</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Date</th>
                    {/* <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v) => (
                    <tr key={v.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-border">
                          {v.photo_url ? (
                            <Image src={v.photo_url} alt={v.first_name} className="w-full h-full object-cover" width={100} height={100} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">👤</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs text-[#f97316] font-bold whitespace-nowrap">{v.volunteer_id}</td>
                      <td className="py-3 px-2 font-semibold whitespace-nowrap">{v.first_name} {v.last_name}</td>
                      <td className="py-3 px-2 text-ink-muted">{v.email}</td>
                      <td className="py-3 px-2 text-ink-muted whitespace-nowrap">{v.phone}</td>
                      <td className="py-3 px-2 text-ink-muted">{v.lga}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          v.status === 'approved' ? 'bg-green-100 text-green-700' :
                          v.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-ink-muted whitespace-nowrap">
                        {new Date(v.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          {v.status !== 'approved' && (
                            <button
                              onClick={() => updateStatus(v.id, 'approved')}
                              className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          {/* {v.status !== 'rejected' && (
                            <button
                              onClick={() => updateStatus(v.id, 'rejected')}
                              className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors"
                            >
                              Reject
                            </button>
                          )} */}
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