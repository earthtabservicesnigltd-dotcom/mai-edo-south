'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

interface Volunteer {
  id: string
  volunteer_id: string
  first_name: string
  last_name: string
  gender: string
  date_of_birth: string
  phone: string
  whatsapp_number: string
  email: string
  residential_address: string
  lga: string
  ward: string
  polling_unit: string
  community: string
  motivation: string
  physical_availability: string
  previous_experience: boolean
  experience_details: string
  volunteer_areas: string[]
  skills: string[]
  commitment: boolean
  declaration: boolean
  status: string
  photo_url: string
  created_at: string
}

export default function VolunteerDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchVolunteer() {
      const res = await fetch(`/api/admin/volunteers/${id}`)
      const data = await res.json()
      if (res.ok) {
        setVolunteer(data.volunteer)
      }
      setLoading(false)
    }
    fetchVolunteer()
  }, [id])

  async function updateStatus(status: string) {
    setUpdating(true)
    await fetch('/api/admin/volunteers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setVolunteer(prev => prev ? { ...prev, status } : prev)
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

  if (!volunteer) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-muted">Volunteer not found.</p>
        <Link href="/admin/volunteers" className="text-[#f97316] font-semibold hover:underline mt-4 block">
          Back to Volunteers
        </Link>
      </div>
    )
  }

  const age = volunteer.date_of_birth
    ? Math.floor((Date.now() - new Date(volunteer.date_of_birth).getTime()) / 3.15576e10)
    : null

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Link href="/admin/volunteers" className="text-[#f97316] text-sm font-semibold hover:underline">
          ← Back to Volunteers
        </Link>
        {volunteer.status === 'approved' && (
          <Link
            href={`/volunteer/card/${volunteer.volunteer_id.replace(/\//g, '-')}`}
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
              {volunteer.photo_url ? (
                <Image src={volunteer.photo_url} alt={volunteer.first_name} width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">👤</div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-heading text-2xl text-[#01381d]">
                    {volunteer.first_name} {volunteer.last_name}
                  </h1>
                  <p className="font-mono text-sm text-[#f97316] font-bold mt-1">{volunteer.volunteer_id}</p>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  volunteer.status === 'approved' ? 'bg-green-100 text-green-700' :
                  volunteer.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {volunteer.status}
                </span>
              </div>
              <div className="flex gap-4 mt-3 flex-wrap text-sm text-ink-muted">
                <span>{volunteer.email}</span>
                <span>{volunteer.phone}</span>
                {volunteer.whatsapp_number && <span>WhatsApp: {volunteer.whatsapp_number}</span>}
              </div>
              <p className="text-xs text-ink-faint mt-2">
                Registered on {new Date(volunteer.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Status actions */}
          <div className="flex gap-2 mt-5 pt-5 border-t border-border">
            {volunteer.status !== 'approved' && (
              <button
                onClick={() => updateStatus('approved')}
                disabled={updating}
                className="px-4 py-2 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors"
              >
                Approve
              </button>
            )}
            {volunteer.status !== 'rejected' && (
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
            <Field label="Gender" value={volunteer.gender} />
            <Field label="Date of Birth" value={volunteer.date_of_birth ? new Date(volunteer.date_of_birth).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'} />
            {age !== null && <Field label="Age" value={`${age} years`} />}
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl text-[#01381d]">LOCATION</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Field label="LGA" value={volunteer.lga} />
            <Field label="Ward" value={volunteer.ward} />
            <Field label="Community" value={volunteer.community} />
            <Field label="Polling Unit" value={volunteer.polling_unit} />
            <Field label="Residential Address" value={volunteer.residential_address} full />
          </div>
        </CardContent>
      </Card>

      {/* Volunteer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl text-[#01381d]">VOLUNTEER INFORMATION</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">Areas of Interest</p>
            <div className="flex flex-wrap gap-2">
              {volunteer.volunteer_areas?.map((area, i) => (
                <span key={i} className="px-2 py-1 bg-[#01381d]/10 text-[#01381d] text-xs font-bold rounded-full">{area}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {volunteer.skills?.map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-[#f97316]/10 text-[#f97316] text-xs font-bold rounded-full">{skill}</span>
              ))}
            </div>
          </div>

          <Field label="Physical Availability" value={volunteer.physical_availability} />
          <Field label="Previous Volunteer Experience" value={volunteer.previous_experience ? 'Yes' : 'No'} />
          {volunteer.previous_experience && volunteer.experience_details && (
            <Field label="Experience Details" value={volunteer.experience_details} full />
          )}

          <div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Motivation</p>
            <p className="text-sm leading-relaxed bg-gray-50 rounded-xl p-4">{volunteer.motivation}</p>
          </div>

          <div className="flex gap-6 pt-2">
            <div className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${volunteer.commitment ? 'bg-green-500' : 'bg-gray-300'}`}>
                {volunteer.commitment ? '✓' : ''}
              </span>
              <span className="text-sm text-ink-muted">Commitment Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${volunteer.declaration ? 'bg-green-500' : 'bg-gray-300'}`}>
                {volunteer.declaration ? '✓' : ''}
              </span>
              <span className="text-sm text-ink-muted">Declaration Signed</span>
            </div>
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