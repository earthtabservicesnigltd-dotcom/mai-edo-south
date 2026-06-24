'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Course {
  id: string
  slug: string
  title: string
  lesson_content: string
}

export default function LessonPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([])

  useEffect(() => {
    async function fetchCourse() {
      const res = await fetch(`/api/academy/courses/${slug}`)
      const data = await res.json()
      if (res.ok) {
        if (!data.enrollment) {
          toast.error('Please enroll in this course first.')
          router.push(`/academy/schools/${slug}`)
          return
        }
        setCourse(data.course)

        // Extract h2 headings for table of contents
        if (data.course.lesson_content) {
          const matches = [...data.course.lesson_content.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)]
          setHeadings(matches.map(m => ({ id: m[1], text: m[2] })))
        }
      }
      setLoading(false)
    }
    fetchCourse()
  }, [slug])

  async function handleComplete() {
    setCompleting(true)
    const res = await fetch(`/api/academy/courses/${slug}/complete-lesson`, { method: 'POST' })
    if (res.ok) {
      toast.success('Lesson completed! Time for the assessment.')
      router.push(`/academy/schools/${slug}/test`)
    } else {
      toast.error('Something went wrong. Please try again.')
    }
    setCompleting(false)
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

  return (
    <div className="max-w-5xl mx-auto flex gap-6">

      {/* Table of contents — sticky sidebar on desktop */}
      {headings.length > 0 && (
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-4 bg-white border border-[#E5E7EB] rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-3">On This Page</p>
            <nav className="flex flex-col gap-2">
              {headings.map(h => (
                <a key={h.id} href={`#${h.id}`} className="text-[12px] text-[#374151] hover:text-[#f97316] transition-colors leading-snug">
                  {h.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}

      {/* Lesson content */}
      <div className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl p-7">
        <h1 className="font-[Syne] text-2xl font-extrabold text-[#111827] mb-6">{course.title}</h1>

        {course.lesson_content ? (
          <div
            className="prose prose-sm max-w-none text-[#374151] leading-relaxed
              [&>h2]:font-[Syne] [&>h2]:font-bold [&>h2]:text-xl [&>h2]:text-[#111827] [&>h2]:mt-10 [&>h2]:mb-3 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-[#E5E7EB] [&>h2]:scroll-mt-4
              [&>h3]:font-[Syne] [&>h3]:font-bold [&>h3]:text-base [&>h3]:text-[#111827] [&>h3]:mt-6 [&>h3]:mb-2
              [&>p]:mb-3
              [&>ul]:mb-3 [&>ul]:list-disc [&>ul]:pl-5
              [&>strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: course.lesson_content }}
          />
        ) : (
          <p className="text-[#9CA3AF] text-sm italic">Lesson content coming soon.</p>
        )}

        <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
          <button
            onClick={handleComplete}
            disabled={completing}
            className="w-full bg-[#f97316] text-white font-bold py-3 rounded-xl hover:bg-[#ea6a05] transition-colors text-sm disabled:opacity-60"
          >
            {completing ? 'Saving...' : "I've Finished — Take the Assessment"}
          </button>
        </div>
      </div>
    </div>
  )
}