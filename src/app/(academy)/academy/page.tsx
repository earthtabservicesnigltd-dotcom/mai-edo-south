'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge, Panel, SectionHead } from '@/components/ui/shared'
import { Skeleton } from '@/components/ui/skeleton'
import { supabaseBrowser } from '@/lib/supabase'

interface Course {
  id: string
  slug: string
  title: string
  short_label: string
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
  currentCourseSlug?: string
}

export default function DashboardPage() {
  const [enrolledSchools, setEnrolledSchools] = useState<SchoolProgress[]>([])
  const [stats, setStats] = useState({ schools: 0, coursesCompleted: 0, certificates: 0 })
  const [studentId, setStudentId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const supabase = supabaseBrowser()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('student_id')
            .eq('id', user.id)
            .single()
          if (profile?.student_id) setStudentId(profile.student_id)
        }

        const schoolsRes = await fetch('/api/academy/schools')
        const schoolsData = await schoolsRes.json()
        const schools: School[] = schoolsData.schools ?? []

        const allCourses = schools.flatMap(s => s.courses.map(c => ({ ...c, school: s })))
        
        const progressResults = await Promise.all(
          allCourses.map(async (c) => {
            const r = await fetch(`/api/academy/courses/${c.slug}`)
            return r.json()
          })
        )

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
          const allSchoolPassed = schoolCourses.length > 0 && schoolCourses.every(c => {
            const prog = progressResults.find(p => p.course?.slug === c.slug)
            return prog?.progress?.passed
          })
          if (allSchoolPassed) totalCerts += 1
        })

        const enrolled: SchoolProgress[] = []
        schools.forEach(school => {
          const schoolCourses = allCourses.filter(c => c.school.slug === school.slug)
          const isEnrolled = schoolCourses.some(c => {
            const prog = progressResults.find(p => p.course?.slug === c.slug)
            return prog?.enrollment
          })

          if (isEnrolled) {
            const data = schoolMap.get(school.slug)!
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
              currentCourseSlug: firstIncomplete?.slug,
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
      <div className="space-y-5">
        <div className="rounded-2xl overflow-hidden mb-5 p-7 bg-[#01381d]">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32 bg-white/20" />
            <Skeleton className="h-10 w-72 bg-white/20" />
            <Skeleton className="h-4 w-96 bg-white/20" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
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
            {studentId && (
              <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-center min-w-[160px]">
                <div className="text-white/50 text-[9px] font-light uppercase tracking-wider mb-1">Student ID</div>
                <div className="font-mono text-sm font-bold text-[#f97316] tracking-wider truncate">{studentId}</div>
              </div>
            )}
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Schools enrolled', val: String(stats.schools), sub: 'of 6 available', iconBg: '#e1f5ee', iconColor: '#0f6e56', icon: 'ti-book-2' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <div>
          <SectionHead title="My Schools" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {enrolledSchools.map(s => (
              <Link key={s.slug} href={`/academy/schools/${s.currentCourseSlug || s.slug}`}
                className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 hover:border-[#f97316] transition-colors">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: s.icon_bg, color: s.icon_color }}>
                    <i className={`ti ${s.icon}`} />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-semibold text-[#111827] leading-tight">{s.title}</div>
                    <div className="text-[11px] text-[#6B7280]">{s.completed} of {s.total} courses</div>
                  </div>
                </div>
                <div className="h-1.5 bg-[#f0ede6] rounded-full overflow-hidden mb-1.5">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.percent}%`, background: s.icon_color }} />
                </div>
                <div className="flex justify-between text-[10.5px] text-[#6B7280]">
                  <span>{s.currentCourse || 'All done!'}</span>
                  <span>{s.percent}%</span>
                </div>
              </Link>
            ))}
            <Link href="/academy/schools" className="bg-[#F7F4EE] border border-dashed border-[#E5E7EB] rounded-xl p-3.5 hover:border-[#f97316] transition-colors">
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
              <span className="w-2 h-2 rounded-full bg-[#f97316] inline-block" /> 
              {enrolledSchools[0]?.title || 'Course'} Progression
            </div>
            <Badge variant="orange">{enrolledSchools[0]?.slug ? 'Active' : '—'}</Badge>
          </div>
          <Panel>
            {enrolledSchools.length > 0 ? (
              <>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#f97316' }} />
                    <div className="w-px flex-1 my-1 bg-[#E5E7EB]" />
                  </div>
                  <div className="pb-3 flex-1">
                    <div className="text-[12.5px] font-semibold text-[#111827] mb-0.5">
                      {enrolledSchools[0].currentCourse || 'First Course'}
                    </div>
                    <div className="text-[11px] text-[#6B7280] mb-1.5">Complete the lesson and assessment</div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                      {enrolledSchools[0].completed === 0 ? 'Current' : 'In Progress'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#9CA3AF' }} />
                    <div className="w-px flex-1 my-1 bg-[#E5E7EB]" />
                  </div>
                  <div className="pb-3 flex-1">
                    <div className="text-[12.5px] font-semibold text-[#111827] mb-0.5">Remaining Courses</div>
                    <div className="text-[11px] text-[#6B7280] mb-1.5">
                      {enrolledSchools[0].total - enrolledSchools[0].completed} more to complete
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Locked</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#f97316' }} />
                  </div>
                  <div className="pb-0 flex-1">
                    <div className="text-[12.5px] font-semibold text-[#111827] mb-0.5">School Certificate</div>
                    <div className="text-[11px] text-[#6B7280] mb-1.5">Earned after all courses passed</div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(249,115,22,0.1)] text-[#f97316]">Goal</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-[#6B7280] text-sm py-4">Enroll in a school to see your progress.</p>
            )}
          </Panel>
        </div>
      </div>

      <SectionHead title="Recent activity" />
      <Panel>
        {(() => {
          const activities: { icon: string; bg: string; color: string; text: string; time: string }[] = []
          
          enrolledSchools.forEach(s => {
            activities.push({
              icon: 'ti-users', bg: '#faeeda', color: '#854f0b',
              text: `Enrolled in ${s.title}`,
              time: `${s.completed}/${s.total} courses done`,
            })
          })

          if (stats.coursesCompleted > 0) {
            activities.push({
              icon: 'ti-check', bg: '#e1f5ee', color: '#0f6e56',
              text: `${stats.coursesCompleted} course${stats.coursesCompleted > 1 ? 's' : ''} completed`,
              time: 'Across all schools',
            })
          }

          if (stats.certificates > 0) {
            activities.push({
              icon: 'ti-certificate', bg: 'rgba(249,115,22,.1)', color: '#f97316',
              text: `${stats.certificates} school certificate${stats.certificates > 1 ? 's' : ''} earned`,
              time: 'Congratulations!',
            })
          }

          if (activities.length === 0) {
            activities.push({
              icon: 'ti-info-circle', bg: '#e6f1fb', color: '#185fa5',
              text: 'Enroll in a school to get started',
              time: 'Your journey begins here',
            })
          }

          return activities.map((a, i) => (
            <div key={i} className={`flex items-start gap-3 py-2.5 ${i < activities.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: a.bg, color: a.color }}>
                <i className={`ti ${a.icon}`} />
              </div>
              <div>
                <div className="text-[12.5px] font-medium text-[#111827]">{a.text}</div>
                <div className="text-[11px] text-[#9CA3AF]">{a.time}</div>
              </div>
            </div>
          ))
        })()}
      </Panel>
    </div>
  )
}
