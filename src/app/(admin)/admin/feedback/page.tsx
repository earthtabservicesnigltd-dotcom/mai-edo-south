'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'

interface Feedback {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  category: string
  subject: string
  message: string
  rating: number
  improvements: string[]
  recommend_score: number
  status: string
  created_at: string
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [filtered, setFiltered] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    async function fetchFeedbacks() {
      const res = await fetch('/api/admin/feedbacks')
      const data = await res.json()
      setFeedbacks(data.feedbacks)
      setFiltered(data.feedbacks)
      setLoading(false)
    }
    fetchFeedbacks()
  }, [])

  useEffect(() => {
    let result = feedbacks
    if (categoryFilter !== 'all') {
      result = result.filter(f => f.category === categoryFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(f =>
        `${f.first_name} ${f.last_name}`.toLowerCase().includes(q) ||
        f.email?.toLowerCase().includes(q) ||
        f.subject?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, categoryFilter, feedbacks])

  const CATEGORY_TABS = ['all', 'general', 'suggestion', 'complaint', 'compliment', 'bug']

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '—'

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">FEEDBACK</h1>
          <p className="text-ink-muted text-sm mt-1">View and manage all user feedback submissions.</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-[#01381d] rounded-xl flex items-center justify-center text-lg">💬</div>
              <span className="font-heading text-2xl text-[#01381d]">{feedbacks.length}</span>
            </div>
            <p className="text-sm font-semibold text-ink-muted">Total Feedback</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-[#f97316] rounded-xl flex items-center justify-center text-lg">⭐</div>
              <span className="font-heading text-2xl text-[#01381d]">{avgRating}</span>
            </div>
            <p className="text-sm font-semibold text-ink-muted">Avg. Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-lg">⚠️</div>
              <span className="font-heading text-2xl text-[#01381d]">
                {feedbacks.filter(f => f.category === 'complaint').length}
              </span>
            </div>
            <p className="text-sm font-semibold text-ink-muted">Complaints</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="font-heading text-xl text-[#01381d]">
              ALL FEEDBACK <span className="text-ink-muted font-sans text-sm font-normal">({filtered.length})</span>
            </CardTitle>
            <Input
              placeholder="Search by name, email, subject..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="field sm:w-72"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {CATEGORY_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setCategoryFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  categoryFilter === tab
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
            <p className="text-ink-muted text-sm text-center py-12">No feedback found.</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm min-w-[1000px]">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Email</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Phone</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Category</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Subject</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Rating</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">NPS</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Improvements</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((f) => (
                    <tr key={f.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 font-semibold whitespace-nowrap">{f.first_name} {f.last_name}</td>
                      <td className="py-3 px-2 text-ink-muted">{f.email}</td>
                      <td className="py-3 px-2 text-ink-muted whitespace-nowrap">{f.phone}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                          f.category === 'complaint' ? 'bg-red-100 text-red-700' :
                          f.category === 'compliment' ? 'bg-green-100 text-green-700' :
                          f.category === 'suggestion' ? 'bg-blue-100 text-blue-700' :
                          f.category === 'bug' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-ink-muted'
                        }`}>
                          {f.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-ink-muted max-w-[180px] truncate">{f.subject}</td>
                      <td className="py-3 px-2 whitespace-nowrap text-[#f97316] font-bold">
                        {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                      </td>
                      <td className="py-3 px-2 font-bold text-[#01381d]">{f.recommend_score}<span className="text-ink-muted font-normal">/10</span></td>
                      <td className="py-3 px-2">
                        <div className="flex flex-wrap gap-1">
                          {f.improvements?.map(tag => (
                            <span key={tag} className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 text-ink-muted capitalize">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-ink-muted whitespace-nowrap">
                        {new Date(f.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
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