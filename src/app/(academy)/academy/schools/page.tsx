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
}

interface EnrollmentInfo {
  course_id: string
  passed: boolean
  lesson_completed: boolean
}

export default function SchoolsPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, EnrollmentInfo>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/academy/courses')
      const data = await res.json()
      setCourses(data.courses ?? [])

      // Fetch progress for each course in parallel
      const progressEntries = await Promise.all(
        (data.courses ?? []).map(async (c: Course) => {
          const r = await fetch(`/api/academy/courses/${c.slug}`)
          const d = await r.json()
          return [c.id, { course_id: c.id, passed: d.progress?.passed ?? false, lesson_completed: d.progress?.lesson_completed ?? false, enrolled: !!d.enrollment }]
        })
      )
      setProgressMap(Object.fromEntries(progressEntries.map(([id, info]: any) => [id, info])))
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
      <p className="text-[13px] text-[#6B7280] font-light leading-relaxed mb-5">
        MAI Academy offers 6 one-day intensive courses designed for young leaders in Edo South. Each course includes a lesson and an assessment.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {courses.map(c => {
          const info: any = progressMap[c.id]
          const passed = info?.passed
          const enrolled = info?.enrolled

          return (
            <Link key={c.id} href={`/academy/schools/${c.slug}`} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col gap-3 transition-all hover:border-[#f97316] hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: c.icon_bg, color: c.icon_color }}>
                  <i className={`ti ${c.icon}`} />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-[#f97316] uppercase tracking-widest mb-1">
                    {passed ? 'Completed' : enrolled ? 'In Progress' : 'Not Enrolled'}
                  </div>
                  <div className="font-[Syne] text-[14px] font-bold text-[#111827] leading-snug">{c.title}</div>
                </div>
              </div>
              <div className="text-[12px] text-[#6B7280] font-light leading-relaxed">{c.description}</div>
              <div className="text-[12px] font-semibold text-[#f97316] flex items-center gap-1">
                {passed ? 'View certificate' : enrolled ? 'Continue course' : 'Start course'} <i className="ti ti-arrow-right text-xs" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}