'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface CertEntry {
  course_id: string
  short_label: string
  title: string
  certificate_title: string
  icon: string
  icon_bg: string
  icon_color: string
  status: 'earned' | 'progress' | 'locked'
  progress: number
  certificate_id?: string
  issued_at?: string
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<CertEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const coursesRes = await fetch('/api/academy/courses')
      const coursesData = await coursesRes.json()
      const courses = coursesData.courses ?? []

      const entries = await Promise.all(
        courses.map(async (c: any) => {
          const r = await fetch(`/api/academy/courses/${c.slug}`)
          const d = await r.json()

          let status: CertEntry['status'] = 'locked'
          let progress = 0

         let certificate_id: string | undefined
          let issued_at: string | undefined

          if (d.progress?.passed) {
            status = 'earned'
            progress = 100

            const certRes = await fetch(`/api/academy/certificates?course_id=${c.id}`)
            const certData = await certRes.json()
            certificate_id = certData.certificate?.certificate_id
            issued_at = certData.certificate?.issued_at
          } else if (d.enrollment) {
            status = 'progress'
            progress = d.progress?.lesson_completed ? 60 : 20
          }

          return {
            course_id: c.id,
            short_label: c.short_label,
            title: c.title,
            certificate_title: c.certificate_title,
            icon: c.icon,
            icon_bg: c.icon_bg,
            icon_color: c.icon_color,
            status,
            progress,
            certificate_id,
            issued_at,
          
          }
        })
      )

      setCerts(entries)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#01381d] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <p className="text-[13px] text-[#6B7280] font-light mb-5">Earn a certificate from each course by completing the lesson and passing the assessment.</p>
      <div className="flex flex-col gap-3">
        {certs.map((c, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex gap-4 items-start hover:border-[rgba(249,115,22,0.3)] hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: c.icon_bg, color: c.icon_color }}>
              <i className="ti ti-certificate" />
            </div>
            <div className="flex-1">
              <div className="font-[Syne] text-[13.5px] font-bold text-[#111827] mb-1">{c.certificate_title}</div>
              <div className="text-[12px] text-[#6B7280] font-light mb-2">{c.short_label}</div>

              {c.status === 'earned' && (
                <>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#eaf3de] text-[#27500a]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b6d11] inline-block" /> Earned
                  </span>
                  {c.certificate_id && (
                    <Link
                      href={`/academy/certificates/${c.certificate_id.replace(/\//g, '-')}`}
                      className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-[#01381d] text-white hover:bg-[#f97316] transition-colors"
                    >
                      <i className="ti ti-certificate text-xs" /> View Certificate
                    </Link>
                  )}
                </>
              )}
              {c.status === 'progress' && (
                <div className="mb-2">
                  <div className="flex justify-between text-[10.5px] text-[#6B7280] mb-1"><span>Progress</span><span>{c.progress}%</span></div>
                  <div className="h-1.5 bg-[#f0ede6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#015b2d] rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              )}
              {c.status === 'locked' && (
                <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                  <i className="ti ti-lock text-xs" /> Not enrolled
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}