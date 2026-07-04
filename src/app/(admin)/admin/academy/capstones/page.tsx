'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'

interface Capstone {
  id: string
  school_slug: string
  title: string
  description: string
  structure: string
  border_color: string
  icon_bg: string
  icon_color: string
}

const SCHOOLS = [
  { slug: 'school-of-politics-policy-governance', label: 'Politics & Governance', border: '#185fa5', bg: '#e6f1fb', color: '#185fa5' },
  { slug: 'school-of-leadership-management', label: 'Leadership & Management', border: '#0f6e56', bg: '#e1f5ee', color: '#0f6e56' },
  { slug: 'school-of-business-entrepreneurship', label: 'Business & Entrepreneurship', border: '#ba7517', bg: '#faeeda', color: '#854f0b' },
  { slug: 'school-of-public-service', label: 'Public Service', border: '#6d28d9', bg: '#f0eaff', color: '#6d28d9' },
  { slug: 'school-of-technology-digital-skills', label: 'Technology & Digital Skills', border: '#3730a3', bg: '#e0e7ff', color: '#3730a3' },
  { slug: 'school-of-ai-machine-learning', label: 'AI & Machine Learning', border: '#831843', bg: '#fce7f3', color: '#831843' },
]

export default function CapstonesAdminPage() {
  const [capstones, setCapstones] = useState<Capstone[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ school_slug: '', title: '', description: '', structure: '', border_color: '', icon_bg: '', icon_color: '' })
  const { toggleSidebar } = useSidebar()

  useEffect(() => { fetchCapstones() }, [])

  async function fetchCapstones() {
    const res = await fetch('/api/admin/academy/capstones')
    const d = await res.json()
    setCapstones(d.capstones ?? []); setLoading(false)
  }

  function selectSchool(slug: string) {
    const s = SCHOOLS.find(x => x.slug === slug)
    setForm(f => ({ ...f, school_slug: slug, border_color: s?.border || '', icon_bg: s?.bg || '', icon_color: s?.color || '' }))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.school_slug) return toast.error('Title and school required')
    const res = await fetch('/api/admin/academy/capstones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    })
    if (res.ok) { toast.success(editingId ? 'Updated' : 'Added'); fetchCapstones(); reset() }
    else toast.error('Failed')
  }

  async function deleteCap(id: string) {
    await fetch('/api/admin/academy/capstones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deleteId: id }) })
    toast.success('Deleted'); fetchCapstones()
  }

  function editCap(c: Capstone) {
    setEditingId(c.id); setForm({ school_slug: c.school_slug, title: c.title, description: c.description || '', structure: c.structure || '', border_color: c.border_color, icon_bg: c.icon_bg, icon_color: c.icon_color })
  }
  function reset() { setEditingId(null); setForm({ school_slug: '', title: '', description: '', structure: '', border_color: '', icon_bg: '', icon_color: '' }) }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><h1 className="font-heading text-4xl text-[#01381d]">CAPSTONES</h1><p className="text-ink-muted text-sm mt-1">Manage capstone projects per school.</p></div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
      </div>

      <Card>
        <CardHeader><CardTitle>{editingId ? 'Edit' : 'Add'} Capstone</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold text-ink-muted uppercase mb-1">School</label>
                <select value={form.school_slug} onChange={e => selectSchool(e.target.value)} className="field w-full px-3 py-2 rounded-lg border border-border text-sm">
                  <option value="">Select school</option>
                  {SCHOOLS.map(s => <option key={s.slug} value={s.slug}>{s.label}</option>)}
                </select>
              </div>
              <div className="flex-[2]">
                <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Title</label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="field w-full px-3 py-2 rounded-lg border border-border text-sm" rows={3} />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Structure</label>
              <Input value={form.structure} onChange={e => setForm(f => ({ ...f, structure: e.target.value }))} placeholder="Problem ID · Background · Solution · Implementation" />
            </div>
            <button type="submit" className="px-4 py-2 bg-[#01381d] text-white text-xs font-bold rounded-xl hover:bg-[#015b2d]">{editingId ? 'Update' : 'Add'}</button>
            {editingId && <button type="button" onClick={reset} className="ml-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200">Cancel</button>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {loading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />)}</div> : capstones.length === 0 ? <p className="text-center py-8 text-ink-muted text-sm">No capstones yet.</p> : (
            <div className="grid grid-cols-2 gap-3">
              {capstones.map(c => {
                const school = SCHOOLS.find(s => s.slug === c.school_slug)
                return (
                  <div key={c.id} className="border border-border rounded-xl p-4" style={{ borderTop: `3px solid ${c.border_color || school?.border || '#ccc'}` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ background: c.icon_bg || school?.bg, color: c.icon_color || school?.color }}>🏆</div>
                      <span className="text-xs font-bold uppercase" style={{ color: c.border_color || school?.border }}>{school?.label}</span>
                    </div>
                    <div className="font-semibold text-sm mb-1">{c.title}</div>
                    <div className="text-xs text-ink-muted line-clamp-2">{c.description}</div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => editCap(c)} className="px-2 py-1 bg-gray-100 text-xs font-bold rounded-lg hover:bg-gray-200">Edit</button>
                      <button onClick={() => deleteCap(c.id)} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200">Delete</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
