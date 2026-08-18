'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'

interface YouthMember {
  id: string
  member_id: string
  full_name: string
  date_of_birth: string
  gender: string
  phone: string
  whatsapp_number: string
  email: string
  lga: string
  ward: string
  community: string
  education: string
  occupation: string
  areas_of_interest: string[]
  commitment: boolean
  status: string
  created_at: string
}

export default function YouthCouncilDetailPage() {
  const { id } = useParams()
  const [member, setMember] = useState<YouthMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchMember() {
      const res = await fetch(`/api/admin/youth-council/${id}`)
      const data = await res.json()
      if (res.ok) setMember(data.member)
      setLoading(false)
    }
    fetchMember()
  }, [id])

  async function updateStatus(status: string) {
    setUpdating(true)
    await fetch('/api/admin/youth-council', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setMember(prev => prev ? { ...prev, status } : prev)
    toast.success(`Status updated to ${status}.`)
    setUpdating(false)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="loader" /></div>
  if (!member) return <div className="text-center py-20"><p className="text-ink-muted">Member not found.</p><Link href="/admin/youth-council" className="text-[#f97316] font-semibold hover:underline mt-4 block">Back to Youth Council</Link></div>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href="/admin/youth-council" className="text-[#f97316] text-sm font-semibold hover:underline">← Back to Youth Council</Link>
        <div className="flex gap-2 w-full sm:w-auto">
          {member.status !== 'approved' && (
            <button onClick={() => updateStatus('approved')} disabled={updating} className="px-4 py-2 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors flex-1 sm:flex-none">Approve</button>
          )}
          {member.status !== 'rejected' && (
            <button onClick={() => updateStatus('rejected')} disabled={updating} className="px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors flex-1 sm:flex-none">Reject</button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-1">
              <h1 className="font-heading text-2xl text-[#01381d]">{member.full_name}</h1>
              <p className="font-mono text-sm text-[#f97316] font-bold mt-1">{member.member_id}</p>
              <div className="flex flex-col sm:flex-row gap-2 mt-3 text-sm text-ink-muted">
                <span>{member.email}</span>
                <span>{member.phone}</span>
                {member.whatsapp_number && <span>WhatsApp: {member.whatsapp_number}</span>}
              </div>
              <p className="text-xs text-ink-faint mt-2">Registered on {new Date(member.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold self-start ${member.status === 'approved' ? 'bg-green-100 text-green-700' : member.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{member.status}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">PERSONAL INFORMATION</CardTitle></CardHeader>
        {/* Responsive Grid */}
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Gender" value={member.gender} />
          <Field label="Date of Birth" value={member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString('en-GB') : '—'} />
          <Field label="Education" value={member.education} />
          <Field label="Occupation" value={member.occupation} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">LOCATION</CardTitle></CardHeader>
        {/* Responsive Grid */}
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="LGA" value={member.lga} />
          <Field label="Ward" value={member.ward} />
          <Field label="Community" value={member.community} full />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">AREAS OF INTEREST</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {member.areas_of_interest?.map((area, i) => (
              <span key={i} className="px-2 py-1 bg-[#01381d]/10 text-[#01381d] text-xs font-bold rounded-full">{area}</span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, value, full }: { label: string; value: string | null | undefined; full?: boolean }) {
  return (
    <div className={`${full ? 'sm:col-span-2' : ''}`}>
      <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold break-words">{value || '—'}</p>
    </div>
  )
}