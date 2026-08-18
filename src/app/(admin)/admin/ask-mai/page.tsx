// app/admin/ask-mai/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import Link from 'next/link'

interface Question {
  id: string
  full_name: string
  email: string
  lga: string
  category: string
  title: string
  question: string
  status: string
  created_at: string
}

export default function AdminAskMAIPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [filtered, setFiltered] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    async function fetchQuestions() {
      const res = await fetch('/api/admin/ask-mai')
      const data = await res.json()
      setQuestions(data.questions || [])
      setFiltered(data.questions || [])
      setLoading(false)
    }
    fetchQuestions()
  }, [])

  useEffect(() => {
    let result = questions
    if (statusFilter !== 'all') result = result.filter(q => q.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(item =>
        item.full_name?.toLowerCase().includes(q) ||
        item.title?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, questions])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/ask-mai', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status } : q))
    toast.success(`Question marked as ${status}.`)
  }

  const STATUS_TABS = ['all', 'received', 'under_review', 'selected', 'answered']

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-[#01381d]">ASK MAI</h1>
          <p className="text-ink-muted text-sm mt-1">Review and moderate submitted questions</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 justify-between">
            <CardTitle className="font-heading text-xl text-[#01381d]">
              ALL QUESTIONS <span className="text-ink-muted font-sans text-sm font-normal">({filtered.length})</span>
            </CardTitle>
            <Input placeholder="Search by name, title, category..." value={search} onChange={e => setSearch(e.target.value)} className="field sm:w-72" />
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {STATUS_TABS.map(tab => (
              <button key={tab} onClick={() => setStatusFilter(tab)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${statusFilter === tab ? 'bg-[#01381d] text-white' : 'bg-gray-100 text-ink-muted hover:bg-gray-200'}`}>{tab.replace('_', ' ')}</button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <p className="text-ink-muted text-sm text-center py-12">No questions found.</p>
          ) : (
            <div className="space-y-0 divide-y divide-border">
              {filtered.map(q => (
                <div key={q.id} className="py-4 px-2 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{q.full_name}</span>
                        <span className="text-ink-muted text-xs">({q.lga})</span>
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{q.category}</span>
                      </div>
                     <Link href={`/admin/ask-mai/${q.id}`} className="font-medium text-sm text-gray-800 mt-1 hover:text-[#f97316] transition-colors block">
                      {q.title}
                    </Link>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{q.question}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold capitalize ${q.status === 'answered' ? 'bg-green-100 text-green-700' : q.status === 'selected' ? 'bg-blue-100 text-blue-700' : q.status === 'under_review' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                        {q.status.replace('_', ' ')}
                      </span>
                      <select 
                        value={q.status} 
                        onChange={(e) => updateStatus(q.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#015b2d]"
                      >
                        <option value="received">Received</option>
                        <option value="under_review">Under Review</option>
                        <option value="selected">Selected</option>
                        <option value="answered">Answered</option>
                      </select>
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