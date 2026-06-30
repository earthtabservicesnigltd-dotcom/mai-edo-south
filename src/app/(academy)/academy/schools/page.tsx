'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Course {
  id: string
  slug: string
  short_label: string
  title: string
  description: string
  icon: string
  icon_bg: string
  icon_color: string
  certificate_title: string
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

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, ProgressInfo>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      // Fetch schools with courses
      const schoolsRes = await fetch('/api/academy/schools')
      const schoolsData = await schoolsRes.json()
      setSchools(schoolsData.schools ?? [])

      // Fetch progress for each course
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#01381d] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <p className="text-[13px] text-[#6B7280] font-light leading-relaxed mb-6">
        MAI Academy offers 6 schools with multiple courses each. Complete courses in order within a school to earn your certificate.
      </p>

      <div className="flex flex-col gap-8">
        {schools.map(school => (
          <div key={school.slug} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
            {/* School header */}
            <div className="px-5 py-4 border-b border-[#E5E7EB]" style={{ background: `${school.icon_bg}40` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: school.icon_bg, color: school.icon_color }}>
                  <i className={`ti ${school.icon}`} />
                </div>
                <div>
                  <h2 className="font-[Syne] text-[16px] font-bold text-[#111827]">{school.title}</h2>
                  <p className="text-[11px] text-[#6B7280]">{school.courses.length} courses</p>
                </div>
              </div>
            </div>

            {/* Courses */}
            <div className="divide-y divide-[#E5E7EB]">
              {school.courses.map(c => {
                const info = progressMap[c.id]
                const isLocked = info?.locked
                const isPassed = info?.passed
                const isEnrolled = info?.enrolled

                return (
                  <div key={c.id} className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${
                    isLocked ? 'opacity-50' : 'hover:bg-[#F7F4EE]'
                  }`}>
                    {/* Status indicator */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                      isPassed ? 'bg-green-100 text-green-700' :
                      isEnrolled ? 'bg-[rgba(249,115,22,0.1)] text-[#f97316]' :
                      isLocked ? 'bg-gray-100 text-gray-400' :
                      'bg-[#F7F4EE] text-[#6B7280]'
                    }`}>
                      {isPassed ? <i className="ti ti-check" /> :
                       isEnrolled ? <i className="ti ti-book" /> :
                       isLocked ? <i className="ti ti-lock" /> :
                       <span className="text-[10px] font-bold">{c.short_label}</span>}
                    </div>

                    {/* Course info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-[#111827]">{c.title}</div>
                      <div className="text-[11px] text-[#6B7280] truncate">{c.short_label}</div>
                    </div>

                    {/* Lock reason or action */}
                    <div className="shrink-0">
                      {isPassed ? (
                        <span className="text-[11px] text-green-600 font-semibold flex items-center gap-1">
                          <i className="ti ti-certificate" /> Completed
                        </span>
                      ) : isLocked ? (
                        <span className="text-[11px] text-gray-400 max-w-[180px] text-right leading-tight block">
                          {info?.lock_reason || 'Locked'}
                        </span>
                      ) : isEnrolled ? (
                        <Link href={`/academy/schools/${c.slug}/lesson`}
                          className="text-[11px] font-semibold text-[#f97316] flex items-center gap-1 hover:underline">
                          Continue <i className="ti ti-arrow-right text-xs" />
                        </Link>
                      ) : (
                        <Link href={`/academy/schools/${c.slug}`}
                          className="text-[11px] font-semibold text-[#f97316] flex items-center gap-1 hover:underline">
                          Start <i className="ti ti-arrow-right text-xs" />
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
