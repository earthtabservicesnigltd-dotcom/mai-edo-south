'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Course {
  id: string
  slug: string
  title: string
  short_label: string
  description: string
  icon: string
  icon_bg: string
  icon_color: string
  certificate_title: string
  intro_video_url?: string
  instructor_name?: string
  assessments_locked?: boolean
  school_slug: string
  school_order_index: number
}

interface Progress {
  lesson_completed: boolean
  passed: boolean
  best_score: number
  total_questions: number
  test_attempts: number
}

interface LockInfo {
  locked: boolean
  reason: string
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export default function CourseDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [lockInfo, setLockInfo] = useState<LockInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [schoolCourses, setSchoolCourses] = useState<any[]>([])
  const [courseProgress, setCourseProgress] = useState<Record<string, any>>({})

  useEffect(() => {
    async function fetchCourse() {
      const res = await fetch(`/api/academy/courses/${slug}`)
      const data = await res.json()
      if (res.ok) {
        setCourse(data.course)
        setEnrollment(data.enrollment)
        setProgress(data.progress)
        setLockInfo(data.locked)

        if (data.course?.school_slug) {
          const schoolsRes = await fetch('/api/academy/schools')
          const schoolsData = await schoolsRes.json()
          const school = schoolsData.schools?.find((s: any) => s.slug === data.course.school_slug)
          const courses = school?.courses || []
          setSchoolCourses(courses)

          const progressMap: Record<string, any> = {}
          await Promise.all(
            courses.map(async (c: any) => {
              const r = await fetch(`/api/academy/courses/${c.slug}`)
              const d = await r.json()
              progressMap[c.id] = {
                passed: d.progress?.passed || false,
                enrolled: !!d.enrollment,
                lesson_completed: d.progress?.lesson_completed || false,
              }
            })
          )
          setCourseProgress(progressMap)
        }
      }
      setLoading(false)
    }
    fetchCourse()
  }, [slug])

  async function handleEnroll() {
    setEnrolling(true)
    const res = await fetch(`/api/academy/courses/${slug}`, { method: 'POST' })
    const data = await res.json()
    if (res.ok) {
      toast.success('Enrolled successfully!')
      router.push(`/academy/schools/${slug}/learn`)
    } else {
      toast.error(data.error || 'Failed to enroll')
    }
    setEnrolling(false)
  }

  function getEmbedUrl(url?: string) {
    if (!url) return null
    if (url.includes('youtube.com/watch')) return url.replace('watch?v=', 'embed/')
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/')
    return url
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#01381d] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!course) {
    return <p className="text-center text-[#6B7280] py-20">Course not found.</p>
  }

  const isEnrolled = !!enrollment
  const lessonDone = progress?.lesson_completed
  const testPassed = progress?.passed
  const isLocked = lockInfo?.locked
  const assessmentLocked = course.assessments_locked !== false
  const embedUrl = getEmbedUrl(course.intro_video_url)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        
        {embedUrl && (
          <div className="aspect-video w-full">
            <iframe src={embedUrl} className="w-full h-full" allowFullScreen title={`${course.title} intro`} />
          </div>
        )}

        <div className="p-7">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: course.icon_bg, color: course.icon_color }}>
              <i className={`ti ${course.icon}`} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-[#f97316] uppercase tracking-widest mb-1">
                One-Day Intensive Course
              </p>
              <h1 className="font-[Syne] text-2xl font-extrabold text-[#111827]">{course.title}</h1>
              {course.instructor_name && (
                <p className="text-[12px] text-[#6B7280] mt-1">
                  <i className="ti ti-user mr-1" />{course.instructor_name}
                </p>
              )}
            </div>
          </div>

          <p className="text-[#6B7280] text-sm leading-relaxed mb-6">{course.description}</p>

          <div className="bg-[#F7F4EE] rounded-xl p-4 mb-6 flex items-center gap-2 text-sm text-[#111827]">
            <i className="ti ti-certificate text-[#f97316]" />
            <span className="font-medium">{course.certificate_title}</span>
          </div>

          {/* School Roadmap */}
          {schoolCourses.length > 0 && (
            <div className="bg-[#F7F4EE] rounded-xl p-4 mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-3 flex items-center gap-2">
                <i className="ti ti-map-2 text-[#f97316]" /> Your School Roadmap
              </h3>
              <div className="divide-y divide-[#E5E7EB]/60">
                {schoolCourses.map((c: any, idx: number) => {
                  const cp = courseProgress[c.id]
                  const status = cp?.passed ? 'done' : cp?.enrolled ? 'current' : 'locked'
                  const isActive = c.slug === slug
                  return (
                    <div key={c.id} className={`flex items-center gap-3 py-2 ${isActive ? 'bg-white rounded-lg -mx-2 px-2' : ''}`}>
                      <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 text-[9px] border-2 ${
                        status === 'done' ? 'bg-green-600 border-green-600 text-white' :
                        status === 'current' ? 'border-orange-500 text-orange-500' :
                        'border-gray-300'
                      }`}>
                        {status === 'done' && <i className="ti ti-check text-white text-[8px]" />}
                        {status === 'current' && <i className="ti ti-record text-[8px]" />}
                      </div>
                      <span className="font-mono text-[10px] text-[#6B7280] w-[30px] shrink-0 font-semibold">{DAYS[idx] || ''}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[12px] leading-tight ${isActive ? 'font-bold text-[#111827]' : status === 'done' ? 'text-green-700' : 'text-[#374151]'}`}>
                          {c.title}
                        </div>
                      </div>
                      <span className={`text-[9px] font-semibold px-2 py-[2px] rounded ml-auto shrink-0 ${
                        status === 'done' ? 'bg-green-100 text-green-700' :
                        status === 'current' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {status === 'done' ? 'Done' : isActive ? 'Here' : status === 'current' ? 'Active' : 'Locked'}
                      </span>
                    </div>
                  )
                })}
                <div className="flex items-center gap-3 py-2">
                  <div className="w-[22px] h-[22px] rounded-full border-2 border-[#f97316] flex items-center justify-center shrink-0">
                    <i className="ti ti-star text-[#f97316] text-[8px]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#6B7280] w-[30px] shrink-0">🎯</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-[#111827]">School Certificate</div>
                  </div>
                  <span className="text-[9px] font-semibold px-2 py-[2px] rounded ml-auto bg-orange-50 text-orange-600">Goal</span>
                </div>
              </div>
            </div>
          )}

          {isLocked && !isEnrolled && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
              <i className="ti ti-lock text-amber-500 text-xl mb-1 block" />
              <p className="text-amber-700 font-semibold text-sm">Course Locked</p>
              <p className="text-amber-600 text-xs mt-1">{lockInfo?.reason}</p>
            </div>
          )}

          {testPassed ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <p className="text-green-700 font-bold text-sm mb-1">✅ Course Passed</p>
              <p className="text-green-600 text-xs">Score: {progress?.best_score}/{progress?.total_questions}</p>
              <p className="text-[#6B7280] text-xs mt-2">Complete all courses in this school to earn your certificate.</p>
              <button onClick={() => router.push('/academy/schools')}
                className="mt-3 text-xs font-semibold text-[#f97316] hover:underline">View School Progress →</button>
            </div>
          ) : isEnrolled ? (
            <div className="flex flex-col gap-2">
              {!lessonDone ? (
                <button onClick={() => router.push(`/academy/schools/${slug}/learn`)}
                  className="bg-[#f97316] text-white font-bold py-3 rounded-xl hover:bg-[#ea6a05] transition-colors text-sm">
                  Continue Lesson
                </button>
              ) : assessmentLocked ? (
                <div className="flex flex-col gap-2">
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                    <i className="ti ti-lock text-red-400 text-lg block mb-1" />
                    <p className="text-red-600 font-semibold text-sm">Assessment Locked</p>
                    <p className="text-red-500 text-xs mt-1">Waiting for admin to open the assessment.</p>
                  </div>
                  <button onClick={() => router.push(`/academy/schools/${slug}/learn`)}
                    className="bg-white border border-[#E5E7EB] text-[#111827] font-bold py-3 rounded-xl hover:bg-[#F7F4EE] transition-colors text-sm">
                    Review Lesson
                  </button>
                </div>
              ) : (
                <button onClick={() => router.push(`/academy/schools/${slug}/test`)}
                  className="bg-[#01381d] text-white font-bold py-3 rounded-xl hover:bg-[#015b2d] transition-colors text-sm">
                  Take Assessment
                </button>
              )}
              {progress && progress.test_attempts > 0 && !testPassed && (
                <p className="text-center text-xs text-[#6B7280]">
                  Last attempt: {progress.best_score}/{progress.total_questions} — try again to pass
                </p>
              )}
            </div>
          ) : !isLocked ? (
            <button onClick={handleEnroll} disabled={enrolling}
              className="w-full bg-[#f97316] text-white font-bold py-3 rounded-xl hover:bg-[#ea6a05] transition-colors text-sm disabled:opacity-60">
              {enrolling ? 'Enrolling...' : 'Start This Course'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
