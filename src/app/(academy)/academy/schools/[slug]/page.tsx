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
}

interface Progress {
  lesson_completed: boolean
  passed: boolean
  best_score: number
  total_questions: number
  test_attempts: number
}

export default function CourseDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-7">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: course.icon_bg, color: course.icon_color }}>
            <i className={`ti ${course.icon}`} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-[#f97316] uppercase tracking-widest mb-1">One-Day Intensive Course</p>
            <h1 className="font-[Syne] text-2xl font-extrabold text-[#111827]">{course.title}</h1>
          </div>
        </div>

        <p className="text-[#6B7280] text-sm leading-relaxed mb-6">{course.description}</p>

        <div className="bg-[#F7F4EE] rounded-xl p-4 mb-6 flex items-center gap-2 text-sm text-[#111827]">
          <i className="ti ti-certificate text-[#f97316]" />
          <span className="font-medium">{course.certificate_title}</span>
        </div>

        {testPassed ? (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <p className="text-green-700 font-bold text-sm mb-1">✅ Course Completed</p>
            <p className="text-green-600 text-xs">Score: {progress?.best_score}/{progress?.total_questions} — Certificate earned</p>
            <button onClick={() => router.push('/academy/certificates')} className="mt-3 text-xs font-semibold text-[#f97316]">
              View Certificate →
            </button>
          </div>
        ) : isEnrolled ? (
          <div className="flex flex-col gap-2">
            {!lessonDone ? (
              <button
                onClick={() => router.push(`/academy/schools/${slug}/learn`)}
                className="bg-[#f97316] text-white font-bold py-3 rounded-xl hover:bg-[#ea6a05] transition-colors text-sm"
              >
                Continue Lesson
              </button>
            ) : (
              <button
                onClick={() => router.push(`/academy/schools/${slug}/test`)}
                className="bg-[#01381d] text-white font-bold py-3 rounded-xl hover:bg-[#015b2d] transition-colors text-sm"
              >
                Take Assessment
              </button>
            )}
            {progress && progress.test_attempts > 0 && !testPassed && (
              <p className="text-center text-xs text-[#6B7280]">
                Last attempt: {progress.best_score}/{progress.total_questions} — try again to pass
              </p>
            )}
          </div>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="w-full bg-[#f97316] text-white font-bold py-3 rounded-xl hover:bg-[#ea6a05] transition-colors text-sm disabled:opacity-60"
          >
            {enrolling ? 'Enrolling...' : 'Start This Course'}
          </button>
        )}
      </div>
    </div>
  )
}