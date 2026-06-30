'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

interface DiasporaMember {
  id: string
  diaspora_id: string
  full_name: string
  gender: string
  date_of_birth: string
  phone: string
  whatsapp_number: string
  email: string
  country: string
  state_province: string
  city: string
  citizenship_status: string
  lga_origin: string
  ward: string
  community: string
  occupation: string
  organization: string
  industry: string
  would_invest: string
  investment_dream: string
  first_action: string
  priority_project: string
  one_project: string
  feels_represented: string
  senator_expectations: string
  bill_policy: string
  development_rating: string
  five_minutes: string
  advisory_council: string
  message_to_mai: string
  pledge: boolean
  status: string
  photo_url: string
  created_at: string
}

export default function DiasporaDetailPage() {
  const { id } = useParams()
  const [member, setMember] = useState<DiasporaMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchMember() {
      const res = await fetch(`/api/admin/diaspora/${id}`)
      const data = await res.json()
      if (res.ok) {
        setMember(data.member)
      }
      setLoading(false)
    }
    fetchMember()
  }, [id])

  async function updateStatus(status: string) {
    setUpdating(true)
    await fetch('/api/admin/diaspora', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setMember(prev => prev ? { ...prev, status } : prev)
    toast.success(`Status updated to ${status}.`)
    setUpdating(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loader" />
      </div>
    )
  }

  if (!member) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-muted">Member not found.</p>
        <Link href="/admin/diaspora" className="text-[#f97316] font-semibold hover:underline mt-4 block">
          Back to Diaspora
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Link href="/admin/diaspora" className="text-[#f97316] text-sm font-semibold hover:underline">
          ← Back to Diaspora
        </Link>
        {member.status === 'approved' && (
          <Link
            href={`/diaspora/card/${member.diaspora_id.replace(/\//g, '-')}`}
            target="_blank"
            className="px-3 py-1.5 bg-[#01381d] text-white text-xs font-bold rounded-lg hover:bg-[#015b2d] transition-colors"
          >
            View ID Card →
          </Link>
        )}
      </div>

      {/* Header card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border border-border shrink-0">
              {member.photo_url ? (
                <Image src={member.photo_url} alt={member.full_name} width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">👤</div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-heading text-2xl text-[#01381d]">{member.full_name}</h1>
                  <p className="font-mono text-sm text-[#f97316] font-bold mt-1">{member.diaspora_id}</p>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  member.status === 'approved' ? 'bg-green-100 text-green-700' :
                  member.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {member.status}
                </span>
              </div>
              <div className="flex gap-4 mt-3 flex-wrap text-sm text-ink-muted">
                <span>{member.email}</span>
                <span>{member.phone}</span>
                {member.whatsapp_number && <span>WhatsApp: {member.whatsapp_number}</span>}
              </div>
              <p className="text-xs text-ink-faint mt-2">
                Registered on {new Date(member.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Status actions */}
          <div className="flex gap-2 mt-5 pt-5 border-t border-border">
            {member.status !== 'approved' && (
              <button
                onClick={() => updateStatus('approved')}
                disabled={updating}
                className="px-4 py-2 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors"
              >
                Approve
              </button>
            )}
            {member.status !== 'rejected' && (
              <button
                onClick={() => updateStatus('rejected')}
                disabled={updating}
                className="px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors"
              >
                Reject
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl text-[#01381d]">PERSONAL INFORMATION</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Gender" value={member.gender} />
            <Field label="Date of Birth" value={member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'} />
          </div>
        </CardContent>
      </Card>

      {/* Diaspora Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl text-[#01381d]">DIASPORA INFORMATION</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Country of Residence" value={member.country} />
            <Field label="State / Province" value={member.state_province} />
            <Field label="City" value={member.city} />
            <Field label="Citizenship Status" value={member.citizenship_status} />
          </div>
        </CardContent>
      </Card>

      {/* Edo South Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl text-[#01381d]">EDO SOUTH CONNECTION</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Field label="LGA of Origin" value={member.lga_origin} />
            <Field label="Ward" value={member.ward} />
            <Field label="Community" value={member.community} full />
          </div>
        </CardContent>
      </Card>

      {/* Professional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl text-[#01381d]">PROFESSIONAL INFORMATION</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Occupation" value={member.occupation} />
            <Field label="Organization" value={member.organization} />
            <Field label="Industry" value={member.industry} />
          </div>
        </CardContent>
      </Card>

      {/* Investment & Priorities */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl text-[#01381d]">INVESTMENT & DEVELOPMENT PRIORITIES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Would Consider Investing" value={member.would_invest} />
          {member.investment_dream && <TextField label="Investment Dream" value={member.investment_dream} />}
          {member.first_action && <TextField label="First Action Requested" value={member.first_action} />}
          <Field label="Priority Constituency Project" value={member.priority_project} />
          {member.one_project && <TextField label="One Project for Community" value={member.one_project} />}
        </CardContent>
      </Card>

      {/* Representation */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl text-[#01381d]">REPRESENTATION & GOVERNANCE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Feels Adequately Represented" value={member.feels_represented} />
          {member.senator_expectations && <TextField label="Expectations from Senator" value={member.senator_expectations} />}
          {member.bill_policy && <TextField label="Bill / Policy to Champion" value={member.bill_policy} />}
          <Field label="Development Rating" value={member.development_rating} />
        </CardContent>
      </Card>

      {/* Final + Advisory */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl text-[#01381d]">FINAL QUESTION & ADVISORY COUNCIL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {member.five_minutes && <TextField label="5 Minutes with Senator MAI" value={member.five_minutes} />}
          <Field label="Would Serve on Advisory Council" value={member.advisory_council} />
          {member.message_to_mai && <TextField label="Message to MAI" value={member.message_to_mai} />}

          <div className="flex items-center gap-2 pt-2">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${member.pledge ? 'bg-green-500' : 'bg-gray-300'}`}>
              {member.pledge ? '✓' : ''}
            </span>
            <span className="text-sm text-ink-muted">Pledge Accepted</span>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

function Field({ label, value, full }: { label: string; value: string | null | undefined; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold">{value || '—'}</p>
    </div>
  )
}

function TextField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm leading-relaxed bg-gray-50 rounded-xl p-4">{value}</p>
    </div>
  )
}