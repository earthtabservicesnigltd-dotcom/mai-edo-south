'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

interface Submission {
  id: string
  full_name: string
  email: string
  phone: string
  whatsapp_number: string
  gender: string
  age_range: string
  lga: string
  ward: string
  community: string
  street: string
  polling_unit: string
  categories: string[]
  issue: string
  duration: string
  affected: string
  priority: string
  solution: string
  consent: boolean
  status: string
  admin_reply: string
  admin_reply_at: string
  created_at: string
}

export default function MAIListensDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchSubmission() {
      const res = await fetch(`/api/admin/mai-listens/${id}`)
      const data = await res.json()
      if (res.ok) {
        setSubmission(data.submission)
        setReply(data.submission.admin_reply ?? '')
        // Mark as read if unread
        if (data.submission.status === 'unread') {
          await fetch('/api/admin/mai-listens', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: 'read' }),
          })
        }
      }
      setLoading(false)
    }
    fetchSubmission()
  }, [id])

  async function handleReply() {
    if (!reply.trim()) {
      toast.error('Please enter a reply before sending.')
      return
    }
    setSending(true)
    const res = await fetch(`/api/admin/mai-listens/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    })
    const data = await res.json()
    if (res.ok) {
      toast.success('Reply sent successfully.')
      setSubmission(prev => prev ? { ...prev, admin_reply: reply, status: 'resolved' } : prev)
    } else {
      toast.error(data.error || 'Failed to send reply.')
    }
    setSending(false)
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this submission?')) return
    setDeleting(true)
    await fetch('/api/admin/mai-listens', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    toast.success('Submission deleted.')
    router.push('/admin/mai-listens')
  }

  async function handleStatusUpdate(status: string) {
    await fetch('/api/admin/mai-listens', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setSubmission(prev => prev ? { ...prev, status } : prev)
    toast.success(`Marked as ${status}.`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loader" />
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-muted">Submission not found.</p>
        <Link href="/admin/mai-listens" className="text-[#f97316] font-semibold hover:underline mt-4 block">
          Back to MAI Listens
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Link href="/admin/mai-listens" className="text-[#f97316] text-sm font-semibold hover:underline">
          ← Back to MAI Listens
        </Link>
        <div className="flex gap-2">
          {submission.status !== 'resolved' && (
            <button
              onClick={() => handleStatusUpdate('resolved')}
              className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors"
            >
              Mark Resolved
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Submission details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading text-xl text-[#01381d]">SUBMISSION DETAILS</CardTitle>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              submission.status === 'resolved' ? 'bg-green-100 text-green-700' :
              submission.status === 'read' ? 'bg-gray-100 text-gray-600' :
              'bg-orange-100 text-orange-700'
            }`}>
              {submission.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Submitter info */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Name</p>
              <p className="font-semibold">{submission.full_name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Phone</p>
              <p className="font-semibold">{submission.phone}</p>
            </div>
            {submission.email && (
              <div>
                <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Email</p>
                <p className="font-semibold">{submission.email}</p>
              </div>
            )}
            {submission.whatsapp_number && (
              <div>
                <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">WhatsApp</p>
                <p className="font-semibold">{submission.whatsapp_number}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Gender</p>
              <p className="font-semibold">{submission.gender}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Age Range</p>
              <p className="font-semibold">{submission.age_range}</p>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">LGA</p>
              <p className="font-semibold">{submission.lga}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Ward</p>
              <p className="font-semibold">{submission.ward}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Community</p>
              <p className="font-semibold">{submission.community}</p>
            </div>
            {submission.street && (
              <div>
                <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Street</p>
                <p className="font-semibold">{submission.street}</p>
              </div>
            )}
            {submission.polling_unit && (
              <div>
                <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Polling Unit</p>
                <p className="font-semibold">{submission.polling_unit}</p>
              </div>
            )}
          </div>

          {/* Issue */}
          <div className="pb-4 border-b border-border space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Categories</p>
              <div className="flex flex-wrap gap-2">
                {submission.categories?.map((cat, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#01381d]/10 text-[#01381d] text-xs font-bold rounded-full">{cat}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Priority</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                submission.priority === 'Very urgent' ? 'bg-red-100 text-red-700' :
                submission.priority === 'Urgent' ? 'bg-orange-100 text-orange-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {submission.priority}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Issue</p>
              <p className="text-sm leading-relaxed bg-gray-50 rounded-xl p-4">{submission.issue}</p>
            </div>
            {submission.duration && (
              <div>
                <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Duration</p>
                <p className="text-sm">{submission.duration}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">People Affected</p>
              <p className="text-sm">{submission.affected}</p>
            </div>
            {submission.solution && (
              <div>
                <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Suggested Solution</p>
                <p className="text-sm leading-relaxed bg-gray-50 rounded-xl p-4">{submission.solution}</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Date Submitted</p>
            <p className="text-sm text-ink-muted">
              {new Date(submission.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reply */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl text-[#01381d]">
            {submission.admin_reply ? 'REPLY SENT' : 'SEND REPLY'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {submission.admin_reply && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">
                Reply sent on {new Date(submission.admin_reply_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{submission.admin_reply}</p>
            </div>
          )}

          {submission.email ? (
            <>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                rows={6}
                placeholder="Type your response to this submission..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors resize-none"
              />
              <Button
                onClick={handleReply}
                disabled={sending}
                className="bg-[#01381d] hover:bg-[#015b2d]"
              >
                {sending ? 'Sending...' : submission.admin_reply ? 'Send Updated Reply' : 'Send Reply'}
              </Button>
            </>
          ) : (
            <p className="text-ink-muted text-sm">This submitter did not provide an email address — no reply can be sent.</p>
          )}
        </CardContent>
      </Card>

    </div>
  )
}