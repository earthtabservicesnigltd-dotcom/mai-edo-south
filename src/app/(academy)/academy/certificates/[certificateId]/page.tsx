'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import CertificateCard from '@/components/academy/CertificateCard'

export default function CertificateViewPage() {
  const { certificateId } = useParams<{ certificateId: string }>()
  const [cert, setCert] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!certificateId) return
    fetch(`/api/academy/certificates/${certificateId}`)
      .then(r => r.json())
      .then(d => {
        setCert(d.certificate ?? null)
        setLoading(false)
      })
  }, [certificateId])

  if (loading) return <div>Loading...</div>
  if (!cert) return <div>Certificate not found</div>

  return (
    <div className="py-10 px-4">
      <CertificateCard cert={cert} showDownload />
    </div>
  )
}