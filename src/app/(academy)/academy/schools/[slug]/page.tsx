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

export default function CourseDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [lockInfo, setLockInfo] = useState<LockInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    async function fetchCourse() {
      const res = await fetch(`/api/academy/courses/${slug}`)
      const data = await res.json()
      if (res.ok) {
        setCourse(data.course)
        setEnrollment(data.enrollment)
        setProgress(data.progress)
        setLockInfo(data.locked)
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

  // YouTube embed helper
  function getEmbedUrl(url?: string) {
    if (!url) return null
    if (url.includes('youtube.com/watch')) {
      return url.replace('watch?v=', 'embed/')
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/')
    }
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
  const embedUrl = getEmbedUrl(course.intro_video_url)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        
        {/* Intro Video */}
        {embedUrl && (
          <div className="aspect-video w-full">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              title={`${course.title} intro`}
            />
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

          {/* Locked state */}
          {isLocked && !isEnrolled && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
              <i className="ti ti-lock text-amber-500 text-xl mb-1 block" />
              <p className="text-amber-700 font-semibold text-sm">Course Locked</p>
              <p className="text-amber-600 text-xs mt-1">{lockInfo?.reason}</p>
            </div>
          )}

          {/* Completed state */}
          {testPassed ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <p className="text-green-700 font-bold text-sm mb-1">✅ Course Passed</p>
              <p className="text-green-600 text-xs">
                Score: {progress?.best_score}/{progress?.total_questions}
              </p>
              <p className="text-[#6B7280] text-xs mt-2">
                Complete all courses in this school to earn your certificate.
              </p>
              <button onClick={() => router.push('/academy/schools')}
                className="mt-3 text-xs font-semibold text-[#f97316] hover:underline">
                View School Progress →
              </button>
            </div>
          ) : isEnrolled ? (
            <div className="flex flex-col gap-2">
              {!lessonDone ? (
                <button onClick={() => router.push(`/academy/schools/${slug}/learn`)}
                  className="bg-[#f97316] text-white font-bold py-3 rounded-xl hover:bg-[#ea6a05] transition-colors text-sm">
                  Continue Lesson
                </button>
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
