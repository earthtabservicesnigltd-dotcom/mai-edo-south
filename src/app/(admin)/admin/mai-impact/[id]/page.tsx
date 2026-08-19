'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

interface Story {
  id: string
  full_name: string
  phone: string
  email: string
  community: string
  lga: string
  state_country: string
  title: string
  story: string
  impact_category: string
  is_true: boolean
  can_publish: boolean
  anonymous: boolean
  status: string
  created_at: string
  file_urls: string[]
}

export default function MAIImpactDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchStory() {
      const res = await fetch(`/api/admin/mai-impact/${id}`)
      const data = await res.json()
      if (res.ok) setStory(data.story)
      setLoading(false)
    }
    fetchStory()
  }, [id])

  async function updateStatus(status: string) {
    setUpdating(true)
    await fetch('/api/admin/mai-impact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setStory(prev => prev ? { ...prev, status } : prev)
    toast.success(`Marked as ${status.replace('_', ' ')}.`)
    setUpdating(false)
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this story?')) return
    
    await fetch('/api/admin/mai-impact', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    
    toast.success('Story deleted.')
    router.push('/admin/mai-impact')
  }

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="loader" /></div>
  if (!story) return <div className="text-center py-20"><p className="text-ink-muted">Story not found.</p><Link href="/admin/mai-impact" className="text-[#f97316] font-semibold hover:underline mt-4 block">Back to MAI Impact</Link></div>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href="/admin/mai-impact" className="text-[#f97316] text-sm font-semibold hover:underline">← Back to MAI Impact</Link>
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            value={story.status} 
            onChange={(e) => updateStatus(e.target.value)} 
            disabled={updating}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-[#015b2d]"
          >
            <option value="received">Received</option>
            <option value="under_review">Under Review</option>
            <option value="featured">Featured</option>
          </select>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors flex-shrink-0">
            Delete
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl text-[#01381d]">{story.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2 text-sm text-ink-muted">
                <span>{story.full_name}</span>
                  {story.anonymous && (
                    <span className="ml-2 inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">
                      Requested Anonymity
                    </span>
                  )}
                <span>•</span>
                <span>{story.phone}</span>
                {story.email && <span>•</span>}
                {story.email && <span>{story.email}</span>}
              </div>
              <p className="text-xs text-ink-faint mt-2">Submitted on {new Date(story.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize self-start ${story.status === 'featured' ? 'bg-green-100 text-green-700' : story.status === 'under_review' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
              {story.status.replace('_', ' ')}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">STORY DETAILS</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
            <Field label="Category" value={story.impact_category} />
            <Field label="LGA" value={story.lga} />
            <Field label="Community" value={story.community} />
            <Field label="State/Country" value={story.state_country} />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">Story</p>
            <p className="text-sm leading-relaxed bg-gray-50 rounded-xl p-4">{story.story}</p>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">Consent Given</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${story.is_true ? 'bg-green-500' : 'bg-gray-300'}`}>{story.is_true ? '✓' : ''}</span>
                <span className="text-sm text-ink-muted">Confirmed True</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${story.can_publish ? 'bg-green-500' : 'bg-gray-300'}`}>{story.can_publish ? '✓' : ''}</span>
                <span className="text-sm text-ink-muted">Authorized to Publish</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${story.anonymous ? 'bg-green-500' : 'bg-gray-300'}`}>{story.anonymous ? '✓' : ''}</span>
                <span className="text-sm text-ink-muted">Requested Anonymity</span>
              </div>
            </div>
          </div>
          {story.file_urls && story.file_urls.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">Uploaded Evidence</p>
              <div className="grid grid-cols-2 gap-4">
                {story.file_urls.map((url: string, i: number) => {
                  const isVideo = url.includes('.webm') || url.includes('.mp4') || url.includes('.mov')
                  const isImage = url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg') || url.includes('.gif')
                  
                  if (isVideo) {
                    return <video key={i} src={url} controls className="w-full rounded-xl border border-gray-200" />
                  } else if (isImage) {
                    return <Image key={i} src={url} width={400} height={300} alt="Evidence" className="w-full rounded-xl border border-gray-200" />
                  } else {
                    return <a key={i} href={url} target="_blank" className="px-3 py-2 bg-[#f97316]/10 text-[#f97316] text-xs font-bold rounded-lg hover:bg-[#f97316]/20 inline-block">📄 View Document</a>
                  }
                })}
              </div>
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