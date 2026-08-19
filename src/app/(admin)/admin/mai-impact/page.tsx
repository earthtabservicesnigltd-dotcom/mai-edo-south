// app/admin/mai-impact/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import Link from 'next/link'

interface Story {
  id: string
  full_name: string
  lga: string
  title: string
  story: string
  impact_category: string
  anonymous: boolean
  status: string
  created_at: string
}

export default function AdminMAIImpactPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [filtered, setFiltered] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    async function fetchStories() {
      const res = await fetch('/api/admin/mai-impact')
      const data = await res.json()
      setStories(data.stories || [])
      setFiltered(data.stories || [])
      setLoading(false)
    }
    fetchStories()
  }, [])

  useEffect(() => {
    let result = stories
    if (statusFilter !== 'all') result = result.filter(s => s.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(item =>
        item.full_name?.toLowerCase().includes(q) ||
        item.title?.toLowerCase().includes(q) ||
        item.impact_category?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, stories])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/mai-impact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setStories(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    toast.success(`Story marked as ${status}.`)
  }
  async function deleteStory(id: string) {
    if (!confirm('Are you sure you want to delete this story and all its attached files?')) return
    
    const res = await fetch('/api/admin/mai-impact', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    
    if (res.ok) {
      setStories(prev => prev.filter(s => s.id !== id))
      toast.success('Story deleted.')
    } else {
      toast.error('Failed to delete story.')
    }
  }

  const STATUS_TABS = ['all', 'received', 'under_review', 'featured']

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-[#01381d]">MAI IMPACT</h1>
          <p className="text-ink-muted text-sm mt-1">Review and feature impact stories</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 justify-between">
            <CardTitle className="font-heading text-xl text-[#01381d]">
              ALL STORIES <span className="text-ink-muted font-sans text-sm font-normal">({filtered.length})</span>
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
            <p className="text-ink-muted text-sm text-center py-12">No stories found.</p>
          ) : (
            <div className="space-y-0 divide-y divide-border">
              {filtered.map(s => (
                <div key={s.id} className="py-4 px-2 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{s.full_name}</span>
                          {s.anonymous && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full font-bold">Anon</span>}
                        </div>
                        <span className="text-ink-muted text-xs">({s.lga})</span>
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{s.impact_category}</span>
                      </div>
                      <Link href={`/admin/mai-impact/${s.id}`} className="font-medium text-sm text-gray-800 mt-1 hover:text-[#f97316] transition-colors block">
                        {s.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{s.story}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold capitalize ${s.status === 'featured' ? 'bg-green-100 text-green-700' : s.status === 'under_review' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                        {s.status.replace('_', ' ')}
                      </span>
                      <select 
                        value={s.status} 
                        onChange={(e) => updateStatus(s.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#015b2d]"
                      >
                        <option value="received">Received</option>
                        <option value="under_review">Under Review</option>
                        <option value="featured">Featured</option>
                      </select>
                       <button 
                        onClick={() => deleteStory(s.id)}
                        className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete Story"
                      >
                        🗑️
                      </button>
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