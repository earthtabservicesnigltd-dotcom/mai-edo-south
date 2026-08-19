'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import { supabaseBrowser } from '@/lib/supabase'
import Image from 'next/image'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { toggleSidebar } = useSidebar()
  
  const [form, setForm] = useState({
    title: '', description: '', date: new Date().toISOString().split('T')[0], time: '', location: '', category: 'community', image_url: ''
  })

  useEffect(() => {
    fetch('/api/admin/events').then(res => res.json()).then(data => {
      setEvents(data.events || [])
      setLoading(false)
    })
  }, [])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const supabase = supabaseBrowser()
    const filePath = `events/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
    const { error } = await supabase.storage.from('site-uploads').upload(filePath, file)
    if (error) return toast.error('Image upload failed')
    const { data } = supabase.storage.from('site-uploads').getPublicUrl(filePath)
    setForm(prev => ({ ...prev, image_url: data.publicUrl }))
    toast.success('Image uploaded!')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/admin/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (res.ok) {
      setEvents(prev => [data.event, ...prev])
      setForm({ title: '', description: '', date: new Date().toISOString().split('T')[0], time: '', location: '', category: 'community', image_url: '' })
      toast.success('Event created!')
    } else {
      toast.error('Failed to create event')
    }
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return
    await fetch('/api/admin/events', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setEvents(prev => prev.filter(e => e.id !== id))
    toast.success('Deleted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">EVENTS</h1>
          <p className="text-ink-muted text-sm mt-1">Schedule campaign events and town halls.</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">ADD EVENT</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Title</label>
                  <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="field" placeholder="Event title" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Description</label>
                  <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" rows={3} placeholder="Event details..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Date</label>
                    <Input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="field" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Time</label>
                    <Input type="time" required value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Location</label>
                  <Input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="field" placeholder="Venue, Benin City" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm">
                    <option value="rally">Rally</option><option value="townhall">Town Hall</option><option value="community">Community Outreach</option><option value="summit">Summit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-2">Event Image (Optional)</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#015b2d] file:text-white hover:file:bg-[#01381d]" />
                  {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 rounded-lg max-h-32 object-cover w-full" />}
                </div>
                <button type="submit" disabled={submitting} className="w-full px-4 py-2 bg-[#f97316] text-white text-xs font-bold rounded-xl hover:bg-[#01381d] transition-colors uppercase tracking-wider disabled:opacity-60">
                  {submitting ? 'Creating...' : 'Create Event'}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">ALL EVENTS ({events.length})</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
              ) : events.length === 0 ? (
                <p className="text-ink-muted text-sm text-center py-12">No events yet.</p>
              ) : (
                <div className="space-y-0 divide-y divide-border">
                  {events.map(e => (
                    <div key={e.id} className="py-4 px-2 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {e.image_url ? <Image src={e.image_url} alt="" width={48} height={48} className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl">📅</div>}
                        <div>
                          <h4 className="font-semibold text-sm">{e.title}</h4>
                          <p className="text-xs text-gray-500">{new Date(e.date).toLocaleDateString('en-GB')} • {e.time} • {e.location}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(e.id)} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors flex-shrink-0">🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}