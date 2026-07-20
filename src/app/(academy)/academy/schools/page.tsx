'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Course {
  id: string
  slug: string
  short_label: string
  title: string
  description: string
  icon: string
  icon_bg: string
  icon_color: string
}

interface School {
  slug: string
  title: string
  description: string
  icon: string
  icon_bg: string
  icon_color: string
  courses: Course[]
}

interface ProgressInfo {
  enrolled: boolean
  passed: boolean
  lesson_completed: boolean
  locked: boolean
  lock_reason: string
}

const SCHOOL_ICONS: Record<string, any> = {
  'school-of-politics-policy-governance': 'ti ti-building-community',
  'school-of-leadership-management': 'ti ti-users',
  'school-of-business-entrepreneurship': 'ti ti-briefcase',
  'school-of-public-service': 'ti ti-government',
  'school-of-technology-and-digital-services': 'ti ti-devices',
  'school-of-ai-machine-learning': 'ti ti-brain',
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, ProgressInfo>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const schoolsRes = await fetch('/api/academy/schools')
      const schoolsData = await schoolsRes.json()
      setSchools(schoolsData.schools ?? [])

      const allCourses = (schoolsData.schools ?? []).flatMap((s: School) => s.courses)
      const progressEntries = await Promise.all(
        allCourses.map(async (c: Course) => {
          const r = await fetch(`/api/academy/courses/${c.slug}`)
          const d = await r.json()
          return [c.id, {
            enrolled: !!d.enrollment,
            passed: d.progress?.passed ?? false,
            lesson_completed: d.progress?.lesson_completed ?? false,
            locked: d.locked?.locked ?? false,
            lock_reason: d.locked?.reason ?? '',
          }]
        })
      )
      setProgressMap(Object.fromEntries(progressEntries))
      setLoading(false)
    }
    fetchData()
  }, [])

  const schoolData = [
    { slug: 'school-of-politics-policy-governance', num: '01', iconBg: '#e6f1fb', iconColor: '#185fa5', cert: 'MAI Professional Certificate in Politics, Policy & Governance', days: ['Mon: Foundations', 'Tue: Policy Making', 'Wed: Communication', 'Thu: Accountability', 'Fri: Capstone Build', 'Sat: Graduation'], activeDays: [0,1,2,3,4] },
    { slug: 'school-of-leadership-management', num: '02', iconBg: '#e1f5ee', iconColor: '#0f6e56', cert: 'MAI Professional Certificate in Leadership & Management', days: ['Mon: Foundations', 'Tue: Team Dynamics', 'Wed: Personal Mgmt', 'Thu: Execution', 'Fri: Capstone Build', 'Sat: Graduation'], activeDays: [0,1,2] },
    { slug: 'school-of-business-entrepreneurship', num: '03', iconBg: '#faeeda', iconColor: '#854f0b', cert: 'MAI Professional Certificate in Business & Entrepreneurship', days: ['Mon: Foundations', 'Tue: Market Research', 'Wed: Business Plan', 'Thu: Marketing', 'Fri: Capstone Build', 'Sat: Graduation'], activeDays: [0,1] },
    { slug: 'school-of-public-service', num: '04', iconBg: '#f0eaff', iconColor: '#6d28d9', cert: 'MAI Professional Certificate in Public Service & Civic Delivery', days: ['Mon: Foundations', 'Tue: Service Mapping', 'Wed: Service Design', 'Thu: Team Delivery', 'Fri: Capstone', 'Sat: Graduation'], activeDays: [] },
    { slug: 'school-of-technology-and-digital-services', num: '05', iconBg: '#e0e7ff', iconColor: '#3730a3', cert: 'MAI Professional Certificate in Technology & Digital Skills', days: ['Mon: Cybersecurity', 'Tue: Digital Marketing', 'Wed: Social Media', 'Thu: Graphics', 'Fri: Capstone', 'Sat: Graduation'], activeDays: [] },
    { slug: 'school-of-ai-machine-learning', num: '06', iconBg: '#fce7f3', iconColor: '#831843', cert: 'MAI Professional Certificate in AI & Machine Learning', days: ['Mon: AI Foundations', 'Tue: Data & AI', 'Wed: Prompt Eng', 'Thu: ML Project', 'Fri: Capstone', 'Sat: Graduation'], activeDays: [] },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#01381d] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <p className="text-[13px] text-[#6B7280] font-light leading-relaxed mb-5">
        MAI Academy offers 6 schools with multiple courses each. Complete all courses in a school to earn your certificate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {schools
          .sort((a, b) => {
            const aIdx = schoolData.findIndex(s => s.slug === a.slug)
            const bIdx = schoolData.findIndex(s => s.slug === b.slug)
            return aIdx - bIdx
          })
          .map((school, idx) => {
          const meta = schoolData.find(s => s.slug === school.slug)!
          const enrolledCourses = school.courses.filter(c => progressMap[c.id]?.enrolled)
          const passedCourses = school.courses.filter(c => progressMap[c.id]?.passed)
          const isEnrolled = enrolledCourses.length > 0
          const progress = school.courses.length > 0 ? Math.round((passedCourses.length / school.courses.length) * 100) : 0
          const firstIncomplete = school.courses.find(c => !progressMap[c.id]?.passed)
          const isLocked = firstIncomplete ? progressMap[firstIncomplete.id]?.locked : false

          return (
            <div key={school.slug}
              className={`bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:border-[#f97316] hover:shadow-[0_4px_24px_rgba(1,56,29,0.1)] hover:-translate-y-0.5 ${!isEnrolled ? 'opacity-75' : ''}`}>
              
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: meta.iconBg, color: meta.iconColor }}>
                  <i className={SCHOOL_ICONS[school.slug] || 'ti ti-book'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-extrabold text-[#f97316] uppercase tracking-widest mb-1">
                    School {meta.num} · {isEnrolled ? 'Enrolled' : 'Not enrolled'}
                  </div>
                  <h2 className="font-[Syne] text-[14px] font-bold text-[#111827] leading-snug">{school.title}</h2>
                </div>
              </div>

              <p className="text-[12px] text-[#6B7280] leading-relaxed font-light">{school.description}</p>

              <div className="flex flex-wrap gap-1">
                {meta.days.map((day, i) => (
                  <span key={i}
                    className={`text-[10px] font-semibold px-2 py-[3px] rounded-full border transition-colors
                      ${meta.activeDays.includes(i)
                        ? 'bg-[rgba(249,115,22,0.1)] text-[#f97316] border-[rgba(249,115,22,0.25)]'
                        : 'text-[#6B7280] border-[#E5E7EB] bg-[#F7F4EE]'}`}>
                    {day}
                  </span>
                ))}
              </div>

              <div className="text-[11px] text-[#6B7280] flex items-center gap-1.5 font-light">
                <i className="ti ti-certificate text-[#f97316]" />
                {meta.cert}
              </div>

              {/* Status / Action */}
              {isEnrolled ? (
                <div className="flex items-center justify-between mt-1">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                    progress === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} />
                    {progress === 100 ? 'Completed' : `${passedCourses.length}/${school.courses.length} courses · ${progress}%`}
                  </span>
                  {firstIncomplete && !progressMap[firstIncomplete.id]?.locked && (
                    <Link href={`/academy/schools/${firstIncomplete.slug}`}
                      className="text-[12px] font-semibold text-[#f97316] flex items-center gap-1 hover:underline">
                      Continue <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              ) : isLocked ? (
                <div className="flex items-center gap-2 mt-1 text-[12px] text-amber-600 font-medium">
                  <i className="ti ti-lock" /> Locked — finish your current school first
                </div>
              ) : (
                <button onClick={() => window.location.href = `/academy/schools/${school.courses[0]?.slug}`}
                  className="text-[12px] font-semibold text-[#f97316] flex items-center gap-1 hover:text-[#015b2d] transition-colors bg-transparent border-none p-0 cursor-pointer mt-1">
                  Enroll in this school <ArrowRight size={14} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
