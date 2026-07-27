'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import CertificateCard from '@/components/academy/CertificateCard'

export default function VerifyCertificatePage() {
  const { certificateId } = useParams<{ certificateId: string }>()
  const [cert, setCert] = useState<any>(null)
  const [valid, setValid] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!certificateId) return
    fetch(`/api/academy/certificates/${certificateId}`)
      .then(r => r.json())
      .then(d => {
        setValid(d.valid ?? !!d.certificate)
        setCert(d.certificate ?? null)
        setLoading(false)
      })
  }, [certificateId])

  if (loading) return <div>Loading...</div>

  if (!valid || !cert) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Certificate Not Found</h1>
        <p className="text-gray-500">This certificate could not be verified.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F4EE] py-10 px-4">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 bg-[#eaf3de] text-[#27500a] text-sm font-semibold px-4 py-2 rounded-full">
          Verified — This certificate is authentic
        </span>
      </div>
      <CertificateCard cert={cert} showDownload={false} />
    </div>
  )
}