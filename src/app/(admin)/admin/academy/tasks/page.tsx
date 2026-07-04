'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'

interface Task {
  id: string
  title: string
  description: string
  school_slug: string
  type_label: string
  day: string
  urgency_label: string
  done: boolean
}

const SCHOOLS = [
  { slug: 'school-of-politics-policy-governance', label: 'Politics & Governance', color: 'bg-blue-100 text-blue-700' },
  { slug: 'school-of-leadership-management', label: 'Leadership & Management', color: 'bg-teal-100 text-teal-700' },
  { slug: 'school-of-business-entrepreneurship', label: 'Business & Entrepreneurship', color: 'bg-amber-100 text-amber-700' },
]

const DAYS = ['Overdue', 'Today', 'Tomorrow', 'This week']

export default function TasksAdminPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', school_slug: '', type_label: 'Individual', day: 'This week', urgency_label: 'Upcoming' })
  const { toggleSidebar } = useSidebar()

  useEffect(() => { fetchTasks() }, [])

  async function fetchTasks() {
    const res = await fetch('/api/admin/academy/tasks')
    const d = await res.json()
    setTasks(d.tasks ?? []); setLoading(false)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title) return toast.error('Title required')
    const res = await fetch('/api/admin/academy/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    })
    if (res.ok) { toast.success(editingId ? 'Updated' : 'Added'); fetchTasks(); reset() }
    else toast.error('Failed')
  }

  async function deleteTask(id: string) {
    await fetch('/api/admin/academy/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deleteId: id }) })
    toast.success('Deleted'); fetchTasks()
  }

  function editTask(t: Task) { setEditingId(t.id); setForm({ title: t.title, description: t.description || '', school_slug: t.school_slug, type_label: t.type_label, day: t.day, urgency_label: t.urgency_label }) }
  function reset() { setEditingId(null); setForm({ title: '', description: '', school_slug: '', type_label: 'Individual', day: 'This week', urgency_label: 'Upcoming' }) }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><h1 className="font-heading text-4xl text-[#01381d]">TASKS</h1><p className="text-ink-muted text-sm mt-1">Manage assignments shown to students.</p></div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
      </div>

      <Card>
        <CardHeader><CardTitle>{editingId ? 'Edit' : 'Add'} Task</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Title</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">School</label>
              <select value={form.school_slug} onChange={e => setForm(f => ({ ...f, school_slug: e.target.value }))} className="field px-3 py-2 rounded-lg border border-border text-sm">
                <option value="">All</option>
                {SCHOOLS.map(s => <option key={s.slug} value={s.slug}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Type</label>
              <select value={form.type_label} onChange={e => setForm(f => ({ ...f, type_label: e.target.value }))} className="field px-3 py-2 rounded-lg border border-border text-sm">
                <option>Individual</option>
                <option>Group · Wed</option>
                <option>Group · Thu</option>
                <option>Group · Fri</option>
                <option>Group · Capstone</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Day</label>
              <select value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))} className="field px-3 py-2 rounded-lg border border-border text-sm">
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Urgency</label>
              <select value={form.urgency_label} onChange={e => setForm(f => ({ ...f, urgency_label: e.target.value }))} className="field px-3 py-2 rounded-lg border border-border text-sm">
                <option>Overdue</option>
                <option>Due today</option>
                <option>Tomorrow</option>
                <option>Fri</option>
                <option>Upcoming</option>
              </select>
            </div>
            <button type="submit" className="px-4 py-2 bg-[#01381d] text-white text-xs font-bold rounded-xl hover:bg-[#015b2d]">{editingId ? 'Update' : 'Add'}</button>
            {editingId && <button type="button" onClick={reset} className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200">Cancel</button>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div> : tasks.length === 0 ? <p className="text-center py-8 text-ink-muted text-sm">No tasks yet.</p> : (
            <div className="space-y-2">
              {tasks.map(t => {
                const school = SCHOOLS.find(s => s.slug === t.school_slug)
                return (
                  <div key={t.id} className="border border-border rounded-xl p-4 flex items-start justify-between gap-4 hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{t.title}</div>
                      {t.description && <div className="text-xs text-ink-muted mt-1">{t.description}</div>}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {school && <span className={`text-xs font-semibold px-2 py-0.5 rounded ${school.color}`}>{school.label}</span>}
                        <span className="text-xs text-ink-muted">{t.type_label}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${t.day === 'Overdue' ? 'bg-red-100 text-red-700' : t.day === 'Today' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{t.day}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => editTask(t)} className="px-2 py-1 bg-gray-100 text-xs font-bold rounded-lg hover:bg-gray-200">Edit</button>
                      <button onClick={() => deleteTask(t.id)} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200">Delete</button>
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
