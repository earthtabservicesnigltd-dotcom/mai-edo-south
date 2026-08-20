'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import { supabaseBrowser } from '@/lib/supabase'
import Image from 'next/image'

export default function AdminMediaPage() {
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { toggleSidebar } = useSidebar()
  
  const [form, setForm] = useState({ title: '', caption: '', category: 'campaign', type: 'image', image_url: '', youtube_url: '' })

  useEffect(() => {
    fetch('/api/admin/media').then(res => res.json()).then(data => {
      setMedia(data.media || [])
      setLoading(false)
    })
  }, [])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const supabase = supabaseBrowser()
    const filePath = `media/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
    const { error } = await supabase.storage.from('site-uploads').upload(filePath, file)
    if (error) return toast.error('Image upload failed')
    const { data } = supabase.storage.from('site-uploads').getPublicUrl(filePath)
    setForm(prev => ({ ...prev, image_url: data.publicUrl, type: 'image' }))
    toast.success('Image uploaded!')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/admin/media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (res.ok) {
      setMedia(prev => [data.media, ...prev])
      setForm({ title: '', caption: '', category: 'campaign', type: 'image', image_url: '', youtube_url: '' })
      toast.success('Media added!')
    } else {
      toast.error('Failed to add')
    }
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this media item?')) return
    await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setMedia(prev => prev.filter(m => m.id !== id))
    toast.success('Deleted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">MEDIA GALLERY</h1>
          <p className="text-ink-muted text-sm mt-1">Add photos and videos to the public gallery.</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">ADD MEDIA</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Title</label>
                  <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="field" placeholder="e.g. Campaign Rally" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Caption (Optional)</label>
                  <Input value={form.caption} onChange={e => setForm({...form, caption: e.target.value})} className="field" placeholder="Short description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm">
                      <option value="campaign">Campaign</option><option value="community">Community</option><option value="events">Events</option><option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Type</label>
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value, image_url: '', youtube_url: ''})} className="w-full px-3 py-2 rounded-lg border border-border text-sm">
                      <option value="image">Image</option><option value="video">YouTube Video</option>
                    </select>
                  </div>
                </div>

                {form.type === 'image' ? (
                  <div>
                    <label className="block text-xs font-bold text-ink-muted uppercase mb-2">Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#015b2d] file:text-white hover:file:bg-[#01381d]" />
                    {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 rounded-lg max-h-32 object-cover w-full" />}
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-ink-muted uppercase mb-1">YouTube URL</label>
                    <Input value={form.youtube_url} onChange={e => setForm({...form, youtube_url: e.target.value})} className="field" placeholder="https://youtube.com/watch?v=..." />
                  </div>
                )}

                <button type="submit" disabled={submitting} className="w-full px-4 py-2 bg-[#f97316] text-white text-xs font-bold rounded-xl hover:bg-[#01381d] transition-colors uppercase tracking-wider disabled:opacity-60">
                  {submitting ? 'Adding...' : 'Add to Gallery'}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">ALL MEDIA ({media.length})</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
              ) : media.length === 0 ? (
                <p className="text-ink-muted text-sm text-center py-12">No media items yet.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {media.map(m => (
                    <div key={m.id} className="relative group rounded-xl overflow-hidden border border-gray-100">
                      {m.type === 'image' && m.image_url ? (
                        <Image src={m.image_url} alt={m.title} width={400} height={200} className="w-full h-32 object-cover" />
                      ) : (
                        <div className="w-full h-32 bg-[#01381d] flex items-center justify-center text-white">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      )}
                      <div className="p-2">
                        <h4 className="font-semibold text-xs truncate">{m.title}</h4>
                        <p className="text-[10px] text-gray-500 uppercase">{m.type}</p>
                      </div>
                      <button onClick={() => handleDelete(m.id)} className="absolute top-2 right-2 w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
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