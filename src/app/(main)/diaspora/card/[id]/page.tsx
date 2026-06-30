'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import DiasporaIDCard from '@/components/DiasporaIDCard'
import Loader from '@/components/Loader'

export default function VolunteerCardPage() {
  const { id } = useParams()
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchMember() {
      const res = await fetch(`/api/diaspora/card/${id}`)
      const data = await res.json()
      if (!res.ok) {
        setError('Member not found.')
      } else {
        setMember(data.member)
      }
      setLoading(false)
    }
    fetchMember()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
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
      <DiasporaIDCard member={member} />
    </div>
  )
}