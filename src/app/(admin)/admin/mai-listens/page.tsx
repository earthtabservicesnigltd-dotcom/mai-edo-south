'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'

interface Submission {
  id: string
  submission_id: string
  full_name: string
  email: string
  phone: string
  category: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'resolved'
  created_at: string
}

const STATUS_TABS = ['all', 'unread', 'read', 'resolved']

const CATEGORY_COLOURS: Record<string, string> = {
  complaint:    'bg-red-100 text-red-700',
  suggestion:   'bg-blue-100 text-blue-700',
  commendation: 'bg-green-100 text-green-700',
  enquiry:      'bg-purple-100 text-purple-700',
}

export default function MAIListensPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filtered, setFiltered] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    async function fetchSubmissions() {
      const res = await fetch('/api/admin/mai-listens')
      const data = await res.json()
      setSubmissions(data.submissions)
      setFiltered(data.submissions)
      setLoading(false)
    }
    fetchSubmissions()
  }, [])

  useEffect(() => {
    let result = submissions
    if (statusFilter !== 'all') result = result.filter(s => s.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.full_name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.subject?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, submissions])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/mai-listens', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: status as Submission['status'] } : s))
    toast.success(`Submission marked as ${status}.`)
  }

  async function resolveAll() {
    const res = await fetch('/api/admin/mai-listens', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolveAll: true }),
    })
    const data = await res.json()
    if (res.ok) {
      setSubmissions(prev => prev.map(s => s.status !== 'resolved' ? { ...s, status: 'resolved' } : s))
      toast.success(`${data.resolved} submission(s) resolved.`)
    }
  }

  const unreadCount = submissions.filter(s => s.status === 'unread').length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">MAI LISTENS</h1>
          <p className="text-ink-muted text-sm mt-1">
            Review public submissions and feedback
            {unreadCount > 0 && (
              <span className="ml-2 inline-block bg-[#f97316] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} unread
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
              ALL SUBMISSIONS <span className="text-ink-muted font-sans text-sm font-normal">({filtered.length})</span>
            </CardTitle>
            <div className="flex gap-3 items-center">
              <button
                onClick={resolveAll}
                className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors uppercase tracking-wider whitespace-nowrap"
              >
                ✅ Resolve All
              </button>
              <Input
                placeholder="Search by name, email, subject..."
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
            <p className="text-ink-muted text-sm text-center py-12">No submissions found.</p>
          ) : (
            <div className="space-y-0 divide-y divide-border">
              {filtered.map(s => (
                <div key={s.id} className={`py-4 px-2 hover:bg-gray-50 transition-colors ${s.status === 'unread' ? 'bg-orange-50/40' : ''}`}>
                  <div className="flex items-start justify-between gap-4">

                    {/* Left: name + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {s.status === 'unread' && (
                          <span className="w-2 h-2 rounded-full bg-[#f97316] shrink-0" />
                        )}
                        <span className="font-semibold text-sm">{s.full_name}</span>
                        <span className="text-ink-muted text-xs">{s.email}</span>
                        {s.phone && <span className="text-ink-muted text-xs">{s.phone}</span>}
                      </div>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                          CATEGORY_COLOURS[s.category?.toLowerCase()] ?? 'bg-gray-100 text-gray-600'
                        }`}>
                          {s.category}
                        </span>
                        <span className="font-medium text-sm text-gray-800">{s.subject}</span>
                      </div>

                      {/* Expandable message */}
                      {expanded === s.id && (
                        <p className="mt-3 text-sm text-gray-600 leading-relaxed bg-white border border-border rounded-xl p-4">
                          {s.message}
                        </p>
                      )}
                    </div>

                    {/* Right: date + status + actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-ink-muted text-xs whitespace-nowrap">
                        {new Date(s.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                        s.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        s.status === 'read'     ? 'bg-gray-100 text-gray-600' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {s.status}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setExpanded(expanded === s.id ? null : s.id)
                            if (s.status === 'unread') updateStatus(s.id, 'read')
                          }}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          {expanded === s.id ? 'Collapse' : 'Read'}
                        </button>
                        {s.status !== 'resolved' && (
                          <button
                            onClick={() => updateStatus(s.id, 'resolved')}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors"
                          >
                            Resolve
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