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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#01381d] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!cert) return <div className="text-center py-20 text-[#6B7280]">Certificate not found</div>

  return (
    <div className="py-10 px-4">
      <CertificateCard cert={cert} showDownload />
    </div>
  )
}
