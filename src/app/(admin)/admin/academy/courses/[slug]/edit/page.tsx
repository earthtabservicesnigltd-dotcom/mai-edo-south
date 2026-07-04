'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

export default function EditCoursePage() {
  const { slug } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', short_label: '', description: '', certificate_title: '',
    instructor_name: '', intro_video_url: '', icon: '', icon_bg: '', icon_color: '',
    lesson_content: '',
  })
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    fetch(`/api/admin/academy/courses/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.course) {
          setForm({
            title: d.course.title || '',
            short_label: d.course.short_label || '',
            description: d.course.description || '',
            certificate_title: d.course.certificate_title || '',
            instructor_name: d.course.instructor_name || '',
            intro_video_url: d.course.intro_video_url || '',
            icon: d.course.icon || '',
            icon_bg: d.course.icon_bg || '',
            icon_color: d.course.icon_color || '',
            lesson_content: d.course.lesson_content || '',
          })
        }
        setLoading(false)
      })
  }, [slug])

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/admin/academy/courses/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        short_label: form.short_label,
        description: form.description,
        certificate_title: form.certificate_title,
        instructor_name: form.instructor_name,
        intro_video_url: form.intro_video_url,
        icon: form.icon,
        icon_bg: form.icon_bg,
        icon_color: form.icon_color,
        lesson_content: form.lesson_content,
      }),
    })
    setSaving(false)
    if (res.ok) { toast.success('Course updated!'); router.push('/admin/academy/courses') }
    else toast.error('Failed to save')
  }

  if (loading) return <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/academy/courses" className="text-[#f97316] text-sm font-semibold hover:underline mb-2 inline-block">← Back to Courses</Link>
          <h1 className="font-heading text-4xl text-[#01381d]">EDIT COURSE</h1>
          <p className="text-ink-muted text-sm mt-1">{form.title}</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">BASIC INFO</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Title</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Short Label</label>
              <Input value={form.short_label} onChange={e => setForm(f => ({ ...f, short_label: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm" rows={3} />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Certificate Title</label>
              <Input value={form.certificate_title} onChange={e => setForm(f => ({ ...f, certificate_title: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Instructor</label>
              <Input value={form.instructor_name} onChange={e => setForm(f => ({ ...f, instructor_name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Intro Video URL</label>
              <Input value={form.intro_video_url} onChange={e => setForm(f => ({ ...f, intro_video_url: e.target.value }))} />
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Icon</label>
                <Input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Icon BG</label>
                <input type="color" value={form.icon_bg} onChange={e => setForm(f => ({ ...f, icon_bg: e.target.value }))}
                  className="w-16 h-10 rounded-lg border border-border cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Icon Color</label>
                <input type="color" value={form.icon_color} onChange={e => setForm(f => ({ ...f, icon_color: e.target.value }))}
                  className="w-16 h-10 rounded-lg border border-border cursor-pointer" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Content Editor */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">LESSON CONTENT</CardTitle></CardHeader>
        <CardContent>
          <p className="text-xs text-ink-muted mb-3">
            <strong>Tip:</strong> Each &lt;h2&gt; should have an <strong>id</strong> attribute for the table of contents, e.g. <code>&lt;h2 id="chapter-1"&gt;</code>. Use lowercase with hyphens. 
            Only &lt;h2&gt; tags appear in the sidebar TOC — use &lt;h3&gt; for sub-sections.
            Look for an already uploaded course, copy and paste to an AI telling it to format all courses using that HTML standard. Make it known not to summarize.
          </p>

          <textarea value={form.lesson_content} onChange={e => setForm(f => ({ ...f, lesson_content: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-border text-sm font-mono leading-relaxed"
            rows={25} 
            placeholder="<h2>Chapter 1</h2><p>Course content here...</p>" />
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex gap-3 justify-end">
        <button onClick={() => router.push('/admin/academy/courses')}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200">Cancel</button>
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-2 bg-[#f97316] text-white text-xs font-bold rounded-xl hover:bg-[#ea6a05] transition-colors disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
