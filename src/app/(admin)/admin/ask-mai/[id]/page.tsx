'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'

interface Question {
  id: string
  full_name: string
  email: string
  phone: string
  lga: string
  community: string
  category: string
  title: string
  question: string
  video_url: string
  attachment_url: string
  status: string
  created_at: string
}

export default function AskMAIDetailPage() {
  const { id } = useParams()
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchQuestion() {
      const res = await fetch(`/api/admin/ask-mai/${id}`)
      const data = await res.json()
      if (res.ok) setQuestion(data.question)
      setLoading(false)
    }
    fetchQuestion()
  }, [id])

  async function updateStatus(status: string) {
    setUpdating(true)
    await fetch('/api/admin/ask-mai', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setQuestion(prev => prev ? { ...prev, status } : prev)
    toast.success(`Marked as ${status.replace('_', ' ')}.`)
    setUpdating(false)
  }

    async function handleDelete() {
    if (!confirm('Are you sure you want to delete this question?')) return
    
    await fetch('/api/admin/ask-mai', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    
    toast.success('Question deleted.')
    router.push('/admin/ask-mai')
  }

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="loader" /></div>
  if (!question) return <div className="text-center py-20"><p className="text-ink-muted">Question not found.</p><Link href="/admin/ask-mai" className="text-[#f97316] font-semibold hover:underline mt-4 block">Back to Ask MAI</Link></div>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href="/admin/ask-mai" className="text-[#f97316] text-sm font-semibold hover:underline">← Back to Ask MAI</Link>
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            value={question.status} 
            onChange={(e) => updateStatus(e.target.value)} 
            disabled={updating}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-[#015b2d]"
          >
            <option value="received">Received</option>
            <option value="under_review">Under Review</option>
            <option value="selected">Selected for Response</option>
            <option value="answered">Answered</option>
          </select>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors flex-shrink-0"
          >
            Delete
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl text-[#01381d]">{question.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2 text-sm text-ink-muted">
                <span>{question.full_name}</span>
                <span>•</span>
                <span>{question.email}</span>
                {question.phone && <span>•</span>}
                {question.phone && <span>{question.phone}</span>}
              </div>
              <p className="text-xs text-ink-faint mt-2">Submitted on {new Date(question.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize self-start ${question.status === 'answered' ? 'bg-green-100 text-green-700' : question.status === 'selected' ? 'bg-blue-100 text-blue-700' : question.status === 'under_review' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
              {question.status.replace('_', ' ')}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">QUESTION DETAILS</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
            <Field label="Category" value={question.category} />
            <Field label="LGA" value={question.lga} />
            <Field label="Community" value={question.community} />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">Question</p>
            <p className="text-sm leading-relaxed bg-gray-50 rounded-xl p-4">{question.question}</p>
          </div>
          
          {(question.video_url || question.attachment_url) && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">Attachments</p>
              
              {question.video_url && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Recorded Video</p>
                  <video src={question.video_url} controls className="w-full max-w-md rounded-xl border border-gray-200" />
                </div>
              )}
              
              {question.attachment_url && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Attachment File</p>
                  <a href={question.attachment_url} target="_blank" className="inline-flex items-center gap-2 px-3 py-2 bg-[#f97316]/10 text-[#f97316] text-xs font-bold rounded-lg hover:bg-[#f97316]/20">
                    📄 View Attachment
                  </a>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold break-words">{value || '—'}</p>
    </div>
  )
}