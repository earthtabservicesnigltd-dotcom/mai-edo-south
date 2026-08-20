'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import { supabaseBrowser } from '@/lib/supabase'
import Image from 'next/image'

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { toggleSidebar } = useSidebar()
  
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', tag: 'Campaign', date: new Date().toISOString().split('T')[0], featured: false, image_url: ''
  })

  useEffect(() => {
    fetch('/api/admin/news').then(res => res.json()).then(data => {
      setArticles(data.articles || [])
      setLoading(false)
    })
  }, [])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const supabase = supabaseBrowser()
    const filePath = `news/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
    const { error } = await supabase.storage.from('site-uploads').upload(filePath, file)
    if (error) return toast.error('Image upload failed')
    const { data } = supabase.storage.from('site-uploads').getPublicUrl(filePath)
    setForm(prev => ({ ...prev, image_url: data.publicUrl }))
    toast.success('Image uploaded!')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/admin/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (res.ok) {
      setArticles(prev => [data.article, ...prev])
      setForm({ title: '', excerpt: '', content: '', tag: 'Campaign', date: new Date().toISOString().split('T')[0], featured: false, image_url: '' })
      toast.success('Article published!')
    } else {
      toast.error('Failed to publish')
    }
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this article?')) return
    await fetch('/api/admin/news', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setArticles(prev => prev.filter(a => a.id !== id))
    toast.success('Deleted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">NEWS</h1>
          <p className="text-ink-muted text-sm mt-1">Publish news articles and updates.</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">ADD ARTICLE</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Title</label>
                  <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="field" placeholder="Article title" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Excerpt</label>
                  <textarea required value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" rows={3} placeholder="Short summary..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Full Article Content</label>
                  <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" rows={6} placeholder="Write the full news article here..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Tag</label>
                    <select value={form.tag} onChange={e => setForm({...form, tag: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm">
                      <option>Campaign</option><option>Community</option><option>Politics</option><option>Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Date</label>
                    <Input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-2">Cover Image</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#015b2d] file:text-white hover:file:bg-[#01381d]" />
                  {form.image_url && <Image src={form.image_url} alt="Preview" width={300} height={200} className="mt-2 rounded-lg max-h-32 object-cover w-full" />}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="w-4 h-4 accent-[#f97316]" />
                  <span className="text-sm text-gray-700">Set as Featured Story</span>
                </label>
                <button type="submit" disabled={submitting} className="w-full px-4 py-2 bg-[#f97316] text-white text-xs font-bold rounded-xl hover:bg-[#01381d] transition-colors uppercase tracking-wider disabled:opacity-60">
                  {submitting ? 'Publishing...' : 'Publish Article'}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">ALL ARTICLES ({articles.length})</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
              ) : articles.length === 0 ? (
                <p className="text-ink-muted text-sm text-center py-12">No articles yet.</p>
              ) : (
                <div className="space-y-0 divide-y divide-border">
                  {articles.map(a => (
                    <div key={a.id} className="py-4 px-2 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {a.image_url ? <Image src={a.image_url} alt="" width={48} height={48} className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl">📰</div>}
                        <div>
                          <h4 className="font-semibold text-sm flex items-center gap-2">{a.title} {a.featured && <span className="text-[9px] bg-[#f97316] text-white px-1.5 py-0.5 rounded-full">FEATURED</span>}</h4>
                          <p className="text-xs text-gray-500">{new Date(a.date).toLocaleDateString('en-GB')} • {a.tag}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(a.id)} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors flex-shrink-0">🗑️</button>
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