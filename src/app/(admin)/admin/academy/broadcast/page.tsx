'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'

const SCHOOLS = [
  { slug: 'school-of-politics-policy-governance', label: 'Politics, Policy & Governance' },
  { slug: 'school-of-leadership-management', label: 'Leadership & Management' },
  { slug: 'school-of-business-entrepreneurship', label: 'Business & Entrepreneurship' },
  { slug: 'school-of-public-service', label: 'Public Service & Civic Delivery' },
  { slug: 'school-of-technology-and-digital-skills', label: 'Technology & Digital Skills' },
  { slug: 'school-of-ai-machine-learning', label: 'AI & Machine Learning' },
]

export default function BroadcastPage() {
  const [schoolSlug, setSchoolSlug] = useState('all')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sender, setSender] = useState('noreply')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toggleSidebar } = useSidebar()

  async function handleSend() {
    if (!subject || !message) return toast.error('Subject and message are required')
    setSending(true)
    setResult(null)
    const res = await fetch('/api/admin/academy/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolSlug, subject, message, sender }),
    })
    const data = await res.json()
    setSending(false)
    if (res.ok) {
      setResult(data)
      toast.success(`Sent to ${data.sent} students`)
    } else {
      toast.error(data.error || 'Failed to send')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">BROADCAST</h1>
          <p className="text-ink-muted text-sm mt-1">Send an email to all students in a school.</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">COMPOSE EMAIL</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Send To</label>
            <select value={schoolSlug} onChange={e => setSchoolSlug(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm">
              <option value="all">All Schools</option>
              {SCHOOLS.map(s => <option key={s.slug} value={s.slug}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-ink-muted uppercase mb-1">From</label>
            <select value={sender} onChange={e => setSender(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm">
              <option value="noreply">noreply@mai4senate.com</option>
              <option value="admin">admin@mai4senate.com</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Subject</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm" placeholder="Email subject" />
          </div>
          <div>
            <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm" rows={10}
              placeholder="Write your message here. It will be personalized with each student's name." />
            <p className="text-xs text-ink-muted mt-1">
              Students will receive: <strong>"Dear [First Name] [Last Name], ..."</strong>
            </p>
          </div>

          {result && (
            <div className={`rounded-xl p-4 ${result.sent > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-sm font-semibold">✅ Sent: {result.sent} | ❌ Failed: {result.failed} | 📊 Total: {result.total}</p>
            </div>
          )}

          <button onClick={handleSend} disabled={sending}
            className="px-6 py-3 bg-[#f97316] text-white font-bold rounded-xl hover:bg-[#ea6a05] transition-colors text-sm disabled:opacity-60">
            {sending ? 'Sending...' : `Send to ${schoolSlug === 'all' ? 'All Schools' : SCHOOLS.find(s => s.slug === schoolSlug)?.label}`}
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
