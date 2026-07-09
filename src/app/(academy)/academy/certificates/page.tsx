'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface SchoolCert {
  slug: string
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

const SCHOOL_META = [
  { slug: 'school-of-politics-policy-governance', icon: 'ti ti-building-community', iconBg: '#e6f1fb', iconColor: '#185fa5', title: 'School of Politics, Policy & Governance', cert: 'MAI Professional Certificate in Politics, Policy & Governance' },
  { slug: 'school-of-leadership-management', icon: 'ti ti-users', iconBg: '#e1f5ee', iconColor: '#0f6e56', title: 'School of Leadership & Management', cert: 'MAI Professional Certificate in Leadership & Management' },
  { slug: 'school-of-business-entrepreneurship', icon: 'ti ti-briefcase', iconBg: '#faeeda', iconColor: '#854f0b', title: 'School of Business & Entrepreneurship', cert: 'MAI Professional Certificate in Business & Entrepreneurship' },
  { slug: 'school-of-public-service', icon: 'ti ti-government', iconBg: '#f0eaff', iconColor: '#6d28d9', title: 'School of Public Service & Civic Delivery', cert: 'MAI Professional Certificate in Public Service & Civic Delivery' },
  { slug: 'school-of-technology-digital-skills', icon: 'ti ti-devices', iconBg: '#e0e7ff', iconColor: '#3730a3', title: 'School of Technology & Digital Skills', cert: 'MAI Professional Certificate in Technology & Digital Skills' },
  { slug: 'school-of-ai-machine-learning', icon: 'ti ti-brain', iconBg: '#fce7f3', iconColor: '#831843', title: 'School of AI & Machine Learning', cert: 'MAI Professional Certificate in AI & Machine Learning' },
]

function CertificateButton({ certificateId }: { certificateId: string }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    function calcTime() {
      const now = new Date()
      const release = new Date(now)
      release.setHours(23, 59, 0, 0)
      if (now > release) {
        release.setDate(release.getDate() + 1)
      }

      const diff = release.getTime() - now.getTime()
      if (diff <= 0) {
        setTimeLeft('ready')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setTimeLeft(`Available in ${hours}h ${minutes}m`)
    }

    calcTime()
    const timer = setInterval(calcTime, 60_000)
    return () => clearInterval(timer)
  }, [])

  if (timeLeft === 'ready') {
    return (
      <Link
        href={`/academy/certificates/${certificateId.replace(/\//g, '-')}`}
        className="inline-flex items-center gap-1 ml-3 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-[#01381d] text-white hover:bg-[#f97316] transition-colors"
      >
        <i className="ti ti-certificate text-xs" /> View Certificate
      </Link>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 ml-3 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-[#f0ede6] text-[#6B7280]">
      <i className="ti ti-clock text-xs" /> {timeLeft}
    </span>
  )
}

export default function CertificatesPage() {
  const [schools, setSchools] = useState<SchoolCert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const schoolsRes = await fetch('/api/academy/schools')
      const schoolsData = await schoolsRes.json()
      const allSchools = schoolsData.schools ?? []

      const certsRes = await fetch('/api/academy/certificates')
      const certsData = await certsRes.json()
      const earnedCerts = certsData.certificates ?? []
      const earnedMap = new Map(earnedCerts.map((c: any) => [c.school_slug, c]))

      const allCourses = allSchools.flatMap((s: any) => s.courses.map((c: any) => ({ ...c, schoolSlug: s.slug })))

      const progressResults = await Promise.all(
        allCourses.map(async (c: any) => {
          const r = await fetch(`/api/academy/courses/${c.slug}`)
          return r.json()
        })
      )

      const result: SchoolCert[] = SCHOOL_META.map(meta => {
        const schoolCourses = allCourses.filter(c => c.schoolSlug === meta.slug)
        const total = schoolCourses.length
        const passedCount = schoolCourses.filter(c => {
          const prog = progressResults.find((p: any) => p.course?.slug === c.slug)
          return prog?.progress?.passed
        }).length
        const enrolledCount = schoolCourses.filter(c => {
          const prog = progressResults.find((p: any) => p.course?.slug === c.slug)
          return prog?.enrollment
        }).length

        const earned = earnedMap.get(meta.slug) as { certificate_id?: string; issued_at?: string } | undefined

        return {
          slug: meta.slug,
          title: meta.title,
          certificate_title: meta.cert,
          icon: meta.icon,
          icon_bg: meta.iconBg,
          icon_color: meta.iconColor,
          status: earned ? 'earned' : enrolledCount > 0 ? 'progress' : 'locked',
          progress: total > 0 ? Math.round((passedCount / total) * 100) : 0,
          certificate_id: earned?.certificate_id,
          issued_at: earned?.issued_at,
        }
      })

      setSchools(result)
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
      <p className="text-[13px] text-[#6B7280] font-light mb-5">
        Earn a certificate for each school by completing all courses within it. Certificates are available after 11:59 PM on the day you complete the school.
      </p>
      <div className="flex flex-col gap-3">
        {schools.map((s, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex gap-4 items-start hover:border-[rgba(249,115,22,0.3)] hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: s.icon_bg, color: s.icon_color }}>
              <i className={s.icon} />
            </div>
            <div className="flex-1">
              <div className="font-[Syne] text-[13.5px] font-bold text-[#111827] mb-1">{s.certificate_title}</div>
              <div className="text-[12px] text-[#6B7280] font-light mb-2">{s.title}</div>

              {s.status === 'earned' && (
                <>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#eaf3de] text-[#27500a]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b6d11] inline-block" /> Earned
                  </span>
                  {s.certificate_id && <CertificateButton certificateId={s.certificate_id} />}
                </>
              )}
              {s.status === 'progress' && (
                <div>
                  <div className="mb-2">
                    <div className="flex justify-between text-[10.5px] text-[#6B7280] mb-1">
                      <span>Progress</span>
                      <span>{s.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#f0ede6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#015b2d] rounded-full" style={{ width: `${s.progress}%` }} />
                    </div>
                  </div>
                  <Link
                    href="/academy/schools"
                    className="text-[11px] font-semibold text-[#f97316] hover:underline"
                  >
                    Continue →
                  </Link>
                </div>
              )}
              {s.status === 'locked' && (
                <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                  <i className="ti ti-lock text-xs" /> Complete a school to earn this certificate
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
