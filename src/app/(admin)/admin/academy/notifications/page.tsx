'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import { Megaphone } from 'lucide-react'

interface Notification {
  id: string
  title: string
  body: string
  icon: string
  bg_color: string
  icon_color: string
  is_global: boolean
  created_at: string
}

export default function NotificationsAdminPage() {
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', body: '', icon: 'ti-bell', bg_color: '#faeeda', icon_color: '#854f0b', is_global: true })
  const { toggleSidebar } = useSidebar()

  useEffect(() => { fetchNotifs() }, [])

  async function fetchNotifs() {
    const res = await fetch('/api/admin/academy/notifications')
    const d = await res.json()
    setNotifs(d.notifications ?? []); setLoading(false)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title) return toast.error('Title required')
    const res = await fetch('/api/admin/academy/notifications', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    })
    if (res.ok) { toast.success(editingId ? 'Updated' : 'Sent!'); fetchNotifs(); reset() }
    else toast.error('Failed')
  }

  async function deleteNotif(id: string) {
    await fetch('/api/admin/academy/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deleteId: id }) })
    toast.success('Deleted'); fetchNotifs()
  }

  function editNotif(n: Notification) { setEditingId(n.id); setForm({ title: n.title, body: n.body || '', icon: n.icon, bg_color: n.bg_color, icon_color: n.icon_color, is_global: n.is_global }) }
  function reset() { setEditingId(null); setForm({ title: '', body: '', icon: 'ti-bell', bg_color: '#faeeda', icon_color: '#854f0b', is_global: true }) }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><h1 className="font-heading text-4xl text-[#01381d]">NOTIFICATIONS</h1><p className="text-ink-muted text-sm mt-1">Send updates to all students.</p></div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
      </div>

      <Card>
        <CardHeader><CardTitle>{editingId ? 'Edit' : 'Send'} Notification</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Title</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Capstone submission due Friday" />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Body</label>
              <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} className="field w-full px-3 py-2 rounded-lg border border-border text-sm" rows={3} placeholder="More details about this notification..." />
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Icon</label>
                <select value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="field px-3 py-2 rounded-lg border border-border text-sm">
                  <option value="ti-bell">Bell</option>
                  <option value="ti-alert-circle">Alert</option>
                  <option value="ti-clock">Clock</option>
                  <option value="ti-check">Check</option>
                  <option value="ti-users">Users</option>
                  <option value="ti-certificate">Certificate</option>
                  <option value="ti-file-text">File</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Color</label>
                <select value={form.bg_color} onChange={e => {
                  const colors: Record<string, string> = { '#fde8e8': '#b42318', '#faeeda': '#854f0b', '#e1f5ee': '#0f6e56', '#e6f1fb': '#185fa5', 'rgba(249,115,22,.1)': '#f97316' }
                  setForm(f => ({ ...f, bg_color: e.target.value, icon_color: colors[e.target.value] || '#854f0b' }))
                }} className="field px-3 py-2 rounded-lg border border-border text-sm">
                  <option value="#faeeda">Amber</option>
                  <option value="#fde8e8">Red</option>
                  <option value="#e1f5ee">Green</option>
                  <option value="#e6f1fb">Blue</option>
                  <option value="rgba(249,115,22,.1)">Orange</option>
                </select>
              </div>
            </div>
            <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-[#f97316] text-white text-xs font-bold rounded-xl hover:bg-[#ea6a05]"><Megaphone size={14} /> {editingId ? 'Update' : 'Send Notification'}</button>
            {editingId && <button type="button" onClick={reset} className="ml-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200">Cancel</button>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {loading ? <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div> : notifs.length === 0 ? <p className="text-center py-8 text-ink-muted text-sm">No notifications yet.</p> : (
            <div className="space-y-2">
              {notifs.map(n => (
                <div key={n.id} className="flex items-start gap-3 border border-border rounded-xl p-4 hover:bg-gray-50">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: n.bg_color, color: n.icon_color }}><i className={`ti ${n.icon}`} /></div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{n.title}</div>
                    {n.body && <div className="text-xs text-ink-muted mt-1">{n.body}</div>}
                    <div className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => editNotif(n)} className="px-2 py-1 bg-gray-100 text-xs font-bold rounded-lg hover:bg-gray-200">Edit</button>
                    <button onClick={() => deleteNotif(n.id)} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200">Delete</button>
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
