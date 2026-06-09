'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import VolunteerIDCard from '@/components/VolunteerIDCard'

export default function VolunteerCardPage() {
  const { id } = useParams()
  const [volunteer, setVolunteer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchVolunteer() {
      const res = await fetch(`/api/volunteer/card/${id}`)
      const data = await res.json()
      if (!res.ok) {
        setError('Volunteer not found.')
      } else {
        setVolunteer(data.volunteer)
      }
      setLoading(false)
    }
    fetchVolunteer()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink-muted">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <VolunteerIDCard volunteer={volunteer} />
    </div>
  )
}