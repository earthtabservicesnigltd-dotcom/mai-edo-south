'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import Link from 'next/link'

interface ScheduleEvent {
  id: string
  day_of_week: number
  day_label: string
  school_slug: string | null
  event_title: string
  event_bg: string
  event_color: string
  is_today: boolean
  sort_order: number
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const SCHOOLS = [
  { slug: 'school-of-politics-policy-governance', label: 'Politics & Governance' },
  { slug: 'school-of-leadership-management', label: 'Leadership & Management' },
  { slug: 'school-of-business-entrepreneurship', label: 'Business & Entrepreneurship' },
]

const COLORS = [
  { bg: '#e6f1fb', color: '#0c447c', label: 'Blue' },
  { bg: '#e1f5ee', color: '#085041', label: 'Green' },
  { bg: '#faeeda', color: '#633806', label: 'Amber' },
  { bg: '#fcebeb', color: '#791f1f', label: 'Red' },
  { bg: 'rgba(249,115,22,.1)', color: '#f97316', label: 'Orange' },
]

export default function ScheduleAdminPage() {
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ event_title: '', day_of_week: 0, day_label: 'Individual', school_slug: '', event_bg: '#e6f1fb', event_color: '#0c447c', is_today: false })
  const { toggleSidebar } = useSidebar()

  useEffect(() => { fetchSchedule() }, [])

  async function fetchSchedule() {
    const res = await fetch('/api/admin/academy/schedule')
    const data = await res.json()
    setSchedule(data.schedule ?? [])
    setLoading(false)
  }

  async function saveEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!form.event_title) return toast.error('Event title is required')
    const res = await fetch('/api/admin/academy/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    })
    if (res.ok) { toast.success(editingId ? 'Event updated' : 'Event added'); fetchSchedule(); setEditingId(null); setForm({ event_title: '', day_of_week: 0, day_label: 'Individual', school_slug: '', event_bg: '#e6f1fb', event_color: '#0c447c', is_today: false }) }
    else toast.error('Failed to save')
  }

  async function deleteEvent(id: string) {
    await fetch('/api/admin/academy/schedule', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    toast.success('Event deleted'); fetchSchedule()
  }

  function editEvent(event: ScheduleEvent) {
    setEditingId(event.id)
    setForm({ event_title: event.event_title, day_of_week: event.day_of_week, day_label: event.day_label, school_slug: event.school_slug || '', event_bg: event.event_bg, event_color: event.event_color, is_today: event.is_today })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">SCHEDULE</h1>
          <p className="text-ink-muted text-sm mt-1">Manage the weekly academy schedule.</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {/* Add/Edit Form */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">{editingId ? 'Edit Event' : 'Add Event'}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={saveEvent} className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Day</label>
              <select value={form.day_of_week} onChange={e => setForm(f => ({ ...f, day_of_week: parseInt(e.target.value) }))} className="field px-3 py-2 rounded-lg border border-border text-sm">
                {DAY_NAMES.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Label</label>
              <input value={form.day_label} onChange={e => setForm(f => ({ ...f, day_label: e.target.value }))} className="field px-3 py-2 rounded-lg border border-border text-sm w-28" placeholder="Individual" />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">School</label>
              <select value={form.school_slug} onChange={e => setForm(f => ({ ...f, school_slug: e.target.value }))} className="field px-3 py-2 rounded-lg border border-border text-sm">
                <option value="">All</option>
                {SCHOOLS.map(s => <option key={s.slug} value={s.slug}>{s.label}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Event Title</label>
              <input value={form.event_title} onChange={e => setForm(f => ({ ...f, event_title: e.target.value }))} className="field px-3 py-2 rounded-lg border border-border text-sm w-full" placeholder="PPG: Foundations of Politics" />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Color</label>
              <select value={form.event_bg} onChange={e => {
                const color = COLORS.find(c => c.bg === e.target.value)
                setForm(f => ({ ...f, event_bg: e.target.value, event_color: color?.color || '#0c447c' }))
              }} className="field px-3 py-2 rounded-lg border border-border text-sm">
                {COLORS.map(c => <option key={c.bg} value={c.bg}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <input type="checkbox" checked={form.is_today} onChange={e => setForm(f => ({ ...f, is_today: e.target.checked }))} className="accent-[#f97316]" id="isToday" />
              <label htmlFor="isToday" className="text-sm cursor-pointer">Today</label>
            </div>
            <button type="submit" className="px-4 py-2 bg-[#01381d] text-white text-xs font-bold rounded-xl hover:bg-[#015b2d] transition-colors">{editingId ? 'Update' : 'Add'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ event_title: '', day_of_week: 0, day_label: 'Individual', school_slug: '', event_bg: '#e6f1fb', event_color: '#0c447c', is_today: false }) }} className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200">Cancel</button>}
          </form>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2.5">
        {DAY_NAMES.map((dayName, dayIndex) => {
          const dayEvents = schedule.filter(e => e.day_of_week === dayIndex)
          const isToday = dayEvents.some(e => e.is_today)
          return (
            <div key={dayIndex} className={`bg-white border rounded-xl p-3 ${isToday ? 'border-[#f97316]' : 'border-[#E5E7EB]'}`}>
              <div className="text-center pb-2 mb-2 border-b border-[#E5E7EB]">
                <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{dayName}</div>
                {dayEvents[0] && <div className={`font-[Syne] text-sm font-extrabold mt-0.5 ${isToday ? 'text-[#f97316]' : 'text-[#111827]'}`}>{dayEvents[0].day_label}</div>}
              </div>
              <div className="flex flex-col gap-1.5">
                {dayEvents.map(event => (
                  <div key={event.id} className="group relative">
                    <div className="text-[10.5px] leading-snug px-2 py-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity" style={{ background: event.event_bg, color: event.event_color }}
                      onClick={() => editEvent(event)}>
                      {event.event_title}
                    </div>
                    <button onClick={() => deleteEvent(event.id)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
