'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'

interface Member {
  id: string
  member_id: string
  full_name: string
  date_of_birth: string
  phone: string
  whatsapp_number: string
  email: string
  lga: string
  ward: string
  community: string
  occupation: string
  areas_of_interest: string[]
  status: string
  created_at: string
}

interface Voice { id: string; category: string; title: string; description: string; status: string; created_at: string }
interface Business { id: string; business_name: string; category: string; description: string; status: string; created_at: string }
interface Leader { id: string; position_held: string; organization: string; community_impact: string; status: string; created_at: string }
interface Nomination { id: string; nominee_name: string; category: string; achievements: string; status: string; created_at: string }

export default function WomenNetworkDetailPage() {
  const { id } = useParams()
  const [member, setMember] = useState<Member | null>(null)
  const [voices, setVoices] = useState<Voice[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [nominations, setNominations] = useState<Nomination[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchMember() {
      const res = await fetch(`/api/admin/women-network/${id}`)
      const data = await res.json()
      if (res.ok) {
        setMember(data.member)
        setVoices(data.voices || [])
        setBusinesses(data.businesses || [])
        setLeaders(data.leaders || [])
        setNominations(data.nominations || [])
      }
      setLoading(false)
    }
    fetchMember()
  }, [id])

  async function updateStatus(status: string) {
    setUpdating(true)
    await fetch('/api/admin/women-network', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setMember(prev => prev ? { ...prev, status } : prev)
    toast.success(`Status updated to ${status}.`)
    setUpdating(false)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="loader" /></div>
  if (!member) return <div className="text-center py-20"><p className="text-ink-muted">Member not found.</p><Link href="/admin/women-network" className="text-[#f97316] font-semibold hover:underline mt-4 block">Back to Women Network</Link></div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href="/admin/women-network" className="text-[#f97316] text-sm font-semibold hover:underline">← Back to Women Network</Link>
        <div className="flex gap-2 w-full sm:w-auto">
          {member.status !== 'approved' && <button onClick={() => updateStatus('approved')} disabled={updating} className="px-4 py-2 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors flex-1 sm:flex-none">Approve</button>}
          {member.status !== 'rejected' && <button onClick={() => updateStatus('rejected')} disabled={updating} className="px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors flex-1 sm:flex-none">Reject</button>}
        </div>
      </div>

      {/* Section 1: Member Profile */}
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
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
            <Field label="Date of Birth" value={member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString('en-GB') : '—'} />
            <Field label="Occupation" value={member.occupation} />
            <Field label="LGA" value={member.lga} />
            <Field label="Ward" value={member.ward} />
            <Field label="Community" value={member.community} full />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Voices Submitted */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">VOICES SUBMITTED ({voices.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {voices.length === 0 ? <p className="text-sm text-gray-400">No voices submitted.</p> : voices.map(v => (
            <div key={v.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between mb-1"><span className="font-semibold text-sm">{v.title}</span><span className="text-xs text-gray-500">{new Date(v.created_at).toLocaleDateString('en-GB')}</span></div>
              <p className="text-xs text-gray-500 mb-2">Category: {v.category}</p>
              <p className="text-sm text-gray-700">{v.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section 3: Businesses Registered */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">BUSINESSES REGISTERED ({businesses.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {businesses.length === 0 ? <p className="text-sm text-gray-400">No businesses registered.</p> : businesses.map(b => (
            <div key={b.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between mb-1"><span className="font-semibold text-sm">{b.business_name}</span><span className="text-xs text-gray-500">{new Date(b.created_at).toLocaleDateString('en-GB')}</span></div>
              <p className="text-xs text-gray-500 mb-2">Category: {b.category}</p>
              <p className="text-sm text-gray-700">{b.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section 4: Leaders Circle Applications */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">LEADERS CIRCLE APPS ({leaders.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {leaders.length === 0 ? <p className="text-sm text-gray-400">No leaders circle applications.</p> : leaders.map(l => (
            <div key={l.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between mb-1"><span className="font-semibold text-sm">{l.position_held} at {l.organization || 'N/A'}</span><span className="text-xs text-gray-500">{new Date(l.created_at).toLocaleDateString('en-GB')}</span></div>
              <p className="text-sm text-gray-700 mt-2">{l.community_impact}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section 5: Nominations Made */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">NOMINATIONS MADE ({nominations.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {nominations.length === 0 ? <p className="text-sm text-gray-400">No nominations made.</p> : nominations.map(n => (
            <div key={n.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between mb-1"><span className="font-semibold text-sm">Nominated: {n.nominee_name}</span><span className="text-xs text-gray-500">{new Date(n.created_at).toLocaleDateString('en-GB')}</span></div>
              <p className="text-xs text-gray-500 mb-2">Category: {n.category}</p>
              <p className="text-sm text-gray-700">{n.achievements}</p>
            </div>
          ))}
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