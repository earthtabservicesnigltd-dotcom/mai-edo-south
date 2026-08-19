'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'

interface Testimonial {
  id: string
  title: string
  youtube_url: string
  author: string
  created_at: string
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', youtube_url: '', author: '' })
  const [submitting, setSubmitting] = useState(false)
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    async function fetchTestimonials() {
      const res = await fetch('/api/admin/testimonials')
      const data = await res.json()
      setTestimonials(data.testimonials || [])
      setLoading(false)
    }
    fetchTestimonials()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setTestimonials(prev => [data.testimonial, ...prev])
      setForm({ title: '', youtube_url: '', author: '' })
      toast.success('Testimonial added!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to add')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return
    const res = await fetch('/api/admin/testimonials', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) {
      setTestimonials(prev => prev.filter(t => t.id !== id))
      toast.success('Deleted')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">TESTIMONIALS</h1>
          <p className="text-ink-muted text-sm mt-1">Add YouTube video testimonials to the MAI Impact page.</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">ADD VIDEO</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Title</label>
                  <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="field" placeholder="How MAI helped my community" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-1">YouTube URL</label>
                  <Input required value={form.youtube_url} onChange={e => setForm({...form, youtube_url: e.target.value})} className="field" placeholder="https://youtube.com/watch?v=..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Author (Optional)</label>
                  <Input value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="field" placeholder="e.g. Mrs. Grace" />
                </div>
                <button type="submit" disabled={submitting} className="w-full px-4 py-2 bg-[#f97316] text-white text-xs font-bold rounded-xl hover:bg-[#01381d] transition-colors uppercase tracking-wider disabled:opacity-60">
                  {submitting ? 'Adding...' : 'Add Testimonial'}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">ALL VIDEOS ({testimonials.length})</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
              ) : testimonials.length === 0 ? (
                <p className="text-ink-muted text-sm text-center py-12">No testimonials yet.</p>
              ) : (
                <div className="space-y-0 divide-y divide-border">
                  {testimonials.map(t => (
                    <div key={t.id} className="py-4 px-2 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-sm">{t.title}</h4>
                        <p className="text-xs text-gray-500 truncate">{t.youtube_url}</p>
                        {t.author && <p className="text-xs text-gray-400 mt-1">By: {t.author}</p>}
                      </div>
                      <button onClick={() => handleDelete(t.id)} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors flex-shrink-0">
                        🗑️
                      </button>
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