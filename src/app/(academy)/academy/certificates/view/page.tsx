'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import CertificateCard from '@/components/academy/CertificateCard'

export default function CertificateViewPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const schoolSlug = searchParams.get('school')
  const [cert, setCert] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!schoolSlug) { setLoading(false); return }

    async function fetchCert() {
      // First try the DB certificate
      const certsRes = await fetch(`/api/academy/certificates?school_slug=${schoolSlug}`)
      const certsData = await certsRes.json()
      if (certsData.certificates?.length > 0) {
        setCert(certsData.certificates[0])
        setLoading(false)
        return
      }

      // No DB cert — generate on-the-fly
      const [schoolsRes, userRes] = await Promise.all([
        fetch('/api/academy/schools'),
        fetch('/api/academy/user/profile'),
      ])
      const schoolsData = await schoolsRes.json()
      const userData = await userRes.json()
      const school = schoolsData.schools?.find((s: any) => s.slug === schoolSlug)

      if (!school) { setLoading(false); return }

      setCert({
        certificate_id: `MAI-${schoolSlug}-${Date.now()}`,
        recipient_name: `${userData.first_name ?? ''} ${userData.last_name ?? ''}`.trim(),
        certificate_title: school.certificate_title ?? '',
        course_title: school.title ?? schoolSlug,
        issued_at: new Date().toISOString(),
        duration: 'One Week',
        school_slug: schoolSlug,
      })
      setLoading(false)
    }
    fetchCert()
  }, [schoolSlug])

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
