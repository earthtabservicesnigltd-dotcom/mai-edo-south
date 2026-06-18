'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import Image from 'next/image'

interface SupportGroup {
  id: string
  support_group_id: string
  org_name: string
  acronym: string
  org_type: string
  state: string
  lga: string
  ward: string
  community: string
  coordinator_name: string
  position: string
  phone: string
  whatsapp: string
  email: string
  total_members: string
  active_members: string
  estimated_supporters: string
  facebook: string
  twitter: string
  instagram: string
  website: string
  group_logo_url: string
  cert_of_reg_url: string
  constitution_url: string
  group_photo_url: string
  membership_database_url: string
  status: 'pending' | 'verified' | 'rejected'
  created_at: string
}

const STATUS_TABS = ['all', 'pending', 'verified', 'rejected']

export default function SupportGroupsPage() {
  const [groups, setGroups] = useState<SupportGroup[]>([])
  const [filtered, setFiltered] = useState<SupportGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await fetch('/api/admin/support-groups')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to fetch')
        setGroups(data.groups ?? [])
        setFiltered(data.groups ?? [])
      } catch (err: any) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchGroups()
  }, [])

  useEffect(() => {
    let result = groups
    if (statusFilter !== 'all') result = result.filter(g => g.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(g =>
        g.org_name?.toLowerCase().includes(q) ||
        g.coordinator_name?.toLowerCase().includes(q) ||
        g.email?.toLowerCase().includes(q) ||
        g.support_group_id?.toLowerCase().includes(q) ||
        g.lga?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, groups])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/support-groups', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setGroups(prev => prev.map(g => g.id === id ? { ...g, status: status as SupportGroup['status'] } : g))
    toast.success(`Group marked as ${status}.`)
  }

  async function verifyAll() {
    const res = await fetch('/api/admin/support-groups', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verifyAll: true }),
    })
    const data = await res.json()
    if (res.ok) {
      setGroups(prev => prev.map(g => g.status === 'pending' ? { ...g, status: 'verified' } : g))
      toast.success(`${data.verified} group(s) verified successfully.`)
    }
  }

  const pendingCount = groups.filter(g => g.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">SUPPORT GROUPS</h1>
          <p className="text-ink-muted text-sm mt-1">
            Manage registered support groups and organizations
            {pendingCount > 0 && (
              <span className="ml-2 inline-block bg-[#f97316] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingCount} pending
              </span>
            )}
          </p>
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
              ALL GROUPS <span className="text-ink-muted font-sans text-sm font-normal">({filtered.length})</span>
            </CardTitle>
            <div className="flex gap-3 items-center">
              <button
                onClick={verifyAll}
                className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors uppercase tracking-wider whitespace-nowrap"
              >
                ✅ Verify All Pending
              </button>
              <Input
                placeholder="Search by org, coordinator, email, ID..."
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
            <p className="text-ink-muted text-sm text-center py-12">No support groups found.</p>
          ) : (
            <div className="space-y-0 divide-y divide-border">
              {filtered.map(g => (
                <div key={g.id} className="py-4 px-2 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">

                    {/* Left: org info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {g.group_logo_url ? (
                          <Image src={g.group_logo_url} alt={g.org_name} width={32} height={32} className="rounded-full object-cover border border-border" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 text-sm">🏛️</div>
                        )}
                        <span className="font-semibold text-sm">{g.org_name}</span>
                        {g.acronym && <span className="text-ink-muted text-xs">({g.acronym})</span>}
                        <span className="font-mono text-xs text-[#f97316] font-bold">{g.support_group_id}</span>
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-ink-muted">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full font-semibold">{g.org_type}</span>
                        <span>{g.coordinator_name} — {g.position}</span>
                        <span>{g.phone}</span>
                        <span>{g.email}</span>
                      </div>

                      <p className="text-xs text-ink-muted mt-1">
                        {g.community && `${g.community}, `}{g.ward && `${g.ward}, `}{g.lga}, {g.state}
                      </p>

                      {/* Expandable details */}
                      {expanded === g.id && (
                        <div className="mt-4 bg-white border border-border rounded-xl p-4 space-y-3 text-sm">
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-xs font-bold text-ink-muted uppercase">Total Members</p>
                              <p className="font-semibold">{g.total_members || '—'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-ink-muted uppercase">Active Members</p>
                              <p className="font-semibold">{g.active_members || '—'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-ink-muted uppercase">Est. Supporters</p>
                              <p className="font-semibold">{g.estimated_supporters || '—'}</p>
                            </div>
                          </div>

                          {g.whatsapp && (
                            <div>
                              <p className="text-xs font-bold text-ink-muted uppercase">WhatsApp</p>
                              <p className="font-semibold">{g.whatsapp}</p>
                            </div>
                          )}

                          {(g.facebook || g.twitter || g.instagram || g.website) && (
                            <div>
                              <p className="text-xs font-bold text-ink-muted uppercase mb-1">Online Presence</p>
                              <div className="flex gap-3 flex-wrap text-xs">
                                {g.facebook && <a href={g.facebook} target="_blank" className="text-blue-600 hover:underline">Facebook</a>}
                                {g.twitter && <a href={g.twitter} target="_blank" className="text-blue-600 hover:underline">X / Twitter</a>}
                                {g.instagram && <a href={g.instagram} target="_blank" className="text-blue-600 hover:underline">Instagram</a>}
                                {g.website && <a href={g.website} target="_blank" className="text-blue-600 hover:underline">Website</a>}
                              </div>
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-bold text-ink-muted uppercase mb-1">Documents</p>
                            <div className="flex gap-3 flex-wrap text-xs">
                              {g.membership_database_url && <a href={g.membership_database_url} target="_blank" className="text-[#f97316] font-semibold hover:underline">Membership DB</a>}
                              {g.cert_of_reg_url && <a href={g.cert_of_reg_url} target="_blank" className="text-[#f97316] font-semibold hover:underline">Certificate of Reg.</a>}
                              {g.constitution_url && <a href={g.constitution_url} target="_blank" className="text-[#f97316] font-semibold hover:underline">Constitution</a>}
                              {g.group_photo_url && <a href={g.group_photo_url} target="_blank" className="text-[#f97316] font-semibold hover:underline">Group Photo</a>}
                              {!g.membership_database_url && !g.cert_of_reg_url && !g.constitution_url && !g.group_photo_url && (
                                <span className="text-ink-faint">No documents uploaded</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: status + actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-ink-muted text-xs whitespace-nowrap">
                        {new Date(g.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                        g.status === 'verified' ? 'bg-green-100 text-green-700' :
                        g.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {g.status}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setExpanded(expanded === g.id ? null : g.id)}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          {expanded === g.id ? 'Collapse' : 'Details'}
                        </button>
                        {g.status !== 'verified' && (
                          <button
                            onClick={() => updateStatus(g.id, 'verified')}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors"
                          >
                            Verify
                          </button>
                        )}
                        {g.status !== 'rejected' && (
                          <button
                            onClick={() => updateStatus(g.id, 'rejected')}
                            className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}