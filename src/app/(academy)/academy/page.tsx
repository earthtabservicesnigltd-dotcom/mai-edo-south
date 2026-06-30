'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge, Panel, SectionHead } from '@/components/ui/shared'

interface Course {
  id: string
  slug: string
  title: string
  short_label: string
  // no school_certificate field
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

interface SchoolProgress {
  slug: string
  title: string
  icon: string
  icon_bg: string
  icon_color: string
  completed: number
  total: number
  percent: number
  currentCourse?: string
}

export default function DashboardPage() {
  const [enrolledSchools, setEnrolledSchools] = useState<SchoolProgress[]>([])
  const [stats, setStats] = useState({ schools: 0, coursesCompleted: 0, certificates: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        // Fetch schools
        const schoolsRes = await fetch('/api/academy/schools')
        const schoolsData = await schoolsRes.json()
        const schools: School[] = schoolsData.schools ?? []

        // Fetch progress for every course across all schools
        const allCourses = schools.flatMap(s => s.courses.map(c => ({ ...c, school: s })))
        
        const progressResults = await Promise.all(
          allCourses.map(async (c) => {
            const r = await fetch(`/api/academy/courses/${c.slug}`)
            return r.json()
          })
        )

        // Build school-level progress
        const schoolMap = new Map<string, { completed: number; total: number }>()
        let totalCompleted = 0
        let totalCerts = 0

        schools.forEach(school => {
          const schoolCourses = allCourses.filter(c => c.school.slug === school.slug)
          const completed = schoolCourses.filter(c => {
            const prog = progressResults.find(p => p.course?.slug === c.slug)
            return prog?.progress?.passed
          }).length
          
          schoolMap.set(school.slug, {
            completed,
            total: schoolCourses.length,
          })

          totalCompleted += completed
          // Count certificates (courses where all passed = school completed)
          // For now, count individual passed courses as certificates
            const certsForSchool = schoolCourses.filter(c => {
            const prog = progressResults.find(p => p.course?.slug === c.slug)
            return prog?.progress?.passed
          }).length
          totalCerts += certsForSchool
        })

        // Find which schools the user is enrolled in
        const enrolled: SchoolProgress[] = []
        schools.forEach(school => {
          const schoolCourses = allCourses.filter(c => c.school.slug === school.slug)
          const isEnrolled = schoolCourses.some(c => {
            const prog = progressResults.find(p => p.course?.slug === c.slug)
            return prog?.enrollment
          })

          if (isEnrolled) {
            const data = schoolMap.get(school.slug)!
            // Find first incomplete course
            const firstIncomplete = schoolCourses.find(c => {
              const prog = progressResults.find(p => p.course?.slug === c.slug)
              return !prog?.progress?.passed
            })
            
            enrolled.push({
              slug: school.slug,
              title: school.title,
              icon: school.icon,
              icon_bg: school.icon_bg,
              icon_color: school.icon_color,
              completed: data.completed,
              total: data.total,
              percent: Math.round((data.completed / data.total) * 100),
              currentCourse: firstIncomplete?.short_label,
            })
          }
        })

        setEnrolledSchools(enrolled)
        setStats({
          schools: enrolled.length,
          coursesCompleted: totalCompleted,
          certificates: totalCerts,
        })
      } catch {}
      setLoading(false)
    }
    fetchDashboard()
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
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-5 p-7" style={{ background: 'linear-gradient(135deg, #01381d 0%, #024d26 100%)' }}>
        <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-[#f97316] text-[11px] font-bold uppercase tracking-widest mb-3">
              <i className="ti ti-flame" /> My Academy
            </div>
            <h1 className="font-[Syne] text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-2">
              Learning Today.<br /><span className="text-[#f97316]">Leading Tomorrow.</span>
            </h1>
            <p className="text-white/60 text-sm font-light leading-relaxed mb-5">
              You&apos;re enrolled in {stats.schools} school{stats.schools !== 1 ? 's' : ''}. Complete all courses in a school to earn your certificate.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/academy/schools" className="inline-flex items-center gap-1.5 bg-white text-[#01381d] text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#f0ede6] transition-colors">
                <i className="ti ti-book-2 text-sm" /> My Schools
              </Link>
              <Link href="/academy/certificates" className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
                <i className="ti ti-certificate text-sm" /> Certificates
              </Link>
            </div>
          </div>
          <div className="flex gap-3 lg:shrink-0">
            {[
              { val: String(stats.schools), sup: '', label: 'Schools enrolled' },
              { val: String(stats.coursesCompleted), sup: '', label: 'Courses done' },
              { val: String(stats.certificates), sup: '', label: 'Certificates' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-center min-w-[80px]">
                <div className="font-[Syne] text-2xl font-extrabold text-white leading-none mb-0.5">
                  {s.val}<span className="text-base text-white/40">{s.sup}</span>
                </div>
                <div className="text-white/50 text-[10px] font-light leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Schools enrolled', val: String(stats.schools), sub: `of 6 available`, iconBg: '#e1f5ee', iconColor: '#0f6e56', icon: 'ti-book-2' },
          { label: 'Courses completed', val: String(stats.coursesCompleted), sub: 'across all schools', iconBg: '#e6f1fb', iconColor: '#185fa5', icon: 'ti-calendar-check' },
          { label: 'In progress', val: String(enrolledSchools.reduce((a, s) => a + (s.completed < s.total ? 1 : 0), 0)), sub: 'schools active', iconBg: '#faeeda', iconColor: '#854f0b', icon: 'ti-clipboard-check' },
          { label: 'Certificates', val: String(stats.certificates), sub: 'earned', iconBg: 'rgba(249,115,22,.1)', iconColor: '#f97316', icon: 'ti-certificate' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-[11px] text-[#6B7280] font-medium mb-1">{s.label}</div>
                <div className="font-[Syne] text-2xl font-extrabold text-[#111827]">{s.val}</div>
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: s.iconBg, color: s.iconColor }}>
                <i className={`ti ${s.icon}`} />
              </div>
            </div>
            <div className="text-[11px] text-[#6B7280]">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Schools + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <div>
          <SectionHead title="My Schools" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {enrolledSchools.map(s => (
              <Link key={s.slug} href="/academy/schools"
                className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 hover:border-[#f97316] transition-colors">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                    style={{ background: s.icon_bg, color: s.icon_color }}>
                    <i className={`ti ${s.icon}`} />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-semibold text-[#111827] leading-tight">{s.title}</div>
                    <div className="text-[11px] text-[#6B7280]">{s.completed} of {s.total} courses</div>
                  </div>
                </div>
                <div className="h-1.5 bg-[#f0ede6] rounded-full overflow-hidden mb-1.5">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${s.percent}%`, background: s.icon_color }} />
                </div>
                <div className="flex justify-between text-[10.5px] text-[#6B7280]">
                  <span>{s.currentCourse || 'All done!'}</span>
                  <span>{s.percent}%</span>
                </div>
              </Link>
            ))}
            <Link href="/academy/enroll" className="bg-[#F7F4EE] border border-dashed border-[#E5E7EB] rounded-xl p-3.5 hover:border-[#f97316] transition-colors">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                  <i className="ti ti-circle-plus" />
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-[#6B7280] leading-tight">Enroll in a new school</div>
                  <div className="text-[11px] text-[#9CA3AF]">6 schools available</div>
                </div>
              </div>
              <div className="text-[11.5px] text-[#f97316] font-semibold flex items-center gap-1">
                Browse schools <i className="ti ti-arrow-right text-xs" />
              </div>
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#111827]">
              <span className="w-2 h-2 rounded-full bg-[#f97316] inline-block" /> This week
            </div>
            <Badge variant="orange">Week 1</Badge>
          </div>
          <Panel>
            {[
              { dot: '#0f6e56', name: 'Complete Course 1', time: 'Complete the lesson and assessment', badgeBg: '#e1f5ee', badgeColor: '#085041', badgeLabel: 'Current', last: false },
              { dot: '#185fa5', name: 'Progress to Course 2', time: 'Unlocks after passing Course 1', badgeBg: '#e6f1fb', badgeColor: '#185fa5', badgeLabel: 'Next', last: false },
              { dot: '#ba7517', name: 'Course 3', time: 'Unlocks after passing Course 2', badgeBg: '#faeeda', badgeColor: '#633806', badgeLabel: 'Locked', last: false },
              { dot: '#9CA3AF', name: 'School Certificate', time: 'Earned after all courses passed', badgeBg: 'rgba(249,115,22,0.1)', badgeColor: '#f97316', badgeLabel: 'Goal', last: true },
            ].map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
                  {!s.last && <div className="w-px flex-1 my-1 bg-[#E5E7EB]" />}
                </div>
                <div className="pb-3 flex-1">
                  <div className="text-[12.5px] font-semibold text-[#111827] mb-0.5">{s.name}</div>
                  <div className="text-[11px] text-[#6B7280] mb-1.5">{s.time}</div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.badgeBg, color: s.badgeColor }}>{s.badgeLabel}</span>
                </div>
              </div>
            ))}
          </Panel>
        </div>
      </div>

      {/* Recent Activity */}
      <SectionHead title="Recent activity" />
      <Panel>
        {[
          { iconBg: '#e1f5ee', iconColor: '#0f6e56', icon: 'ti-check', text: 'Course lesson completed', time: 'Today' },
          { iconBg: '#faeeda', iconColor: '#854f0b', icon: 'ti-users', text: 'Enrolled in a new school', time: 'Yesterday' },
          { iconBg: '#e6f1fb', iconColor: '#185fa5', icon: 'ti-file-text', text: 'Assessment submitted', time: '2 days ago' },
          { iconBg: 'rgba(249,115,22,.1)', iconColor: '#f97316', icon: 'ti-certificate', text: 'Certificate earned', time: '3 days ago' },
        ].map((a, i) => (
          <div key={i} className={`flex items-start gap-3 py-2.5 ${i < 3 ? 'border-b border-[#E5E7EB]' : ''}`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: a.iconBg, color: a.iconColor }}>
              <i className={`ti ${a.icon}`} />
            </div>
            <div>
              <div className="text-[12.5px] font-medium text-[#111827]">{a.text}</div>
              <div className="text-[11px] text-[#9CA3AF]">{a.time}</div>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  )
}
