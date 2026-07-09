'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
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
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    // In LessonPage, replace the existing fetchCourse function:
    async function fetchCourse() {
      const res = await fetch(`/api/academy/courses/${slug}`)
      const data = await res.json()
      if (res.ok) {
        // Check lock first
        if (data.locked?.locked) {
          toast.error(data.locked.reason)
          router.push(`/academy/schools`)
          return
        }

        if (!data.enrollment) {
          toast.error('Please enroll in this course first.')
          router.push(`/academy/schools/${slug}`)
          return
        }
        setCourse(data.course)

        if (data.course.lesson_content) {
          const matches = [...data.course.lesson_content.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)]
          const extracted = matches.map(m => ({ id: m[1], text: m[2] }))
          setHeadings(extracted)
          if (extracted.length > 0) setActiveId(extracted[0].id)
        }
      }
      setLoading(false)
    }

    fetchCourse()
  }, [slug, router])

  // Scroll spy — watches headings inside layout scroll container
  useEffect(() => {
    if (!headings.length) return

    const scrollRoot = document.querySelector('[data-academy-scroll]')
    if (!scrollRoot) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        root: scrollRoot,
        rootMargin: '-10% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings, course?.lesson_content])

  function scrollToHeading(id: string) {
    setActiveId(id)
    const scrollRoot = document.querySelector('[data-academy-scroll]')
    const target = document.getElementById(id)
    if (!scrollRoot || !target) return

    const rootRect = scrollRoot.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const offset = targetRect.top - rootRect.top + scrollRoot.scrollTop - 16

    scrollRoot.scrollTo({ top: offset, behavior: 'smooth' })
  }

  async function handleComplete() {
    setCompleting(true)
    const res = await fetch(`/api/academy/courses/${slug}/learn`, { method: 'POST' })
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
    <div className="max-w-5xl mx-auto flex gap-8 items-start">

      {headings.length > 0 && (
        <aside className="hidden lg:block w-56 shrink-0 sticky top-4 self-start">
          <nav className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-3">
              On This Page
            </p>
            <div className="flex flex-col gap-1">
              {headings.map(h => {
                const isActive = activeId === h.id
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => scrollToHeading(h.id)}
                    className={[
                      'text-left text-[12px] leading-snug transition-all duration-200 rounded-lg px-2 py-1.5 w-full cursor-pointer',
                      isActive
                        ? 'text-[#f97316] font-semibold bg-[rgba(249,115,22,0.12)] border-l-2 border-[#f97316] pl-3 shadow-[0_0_12px_rgba(249,115,22,0.25)]'
                        : 'text-[#374151] hover:text-[#f97316] hover:bg-[#F7F4EE] border-l-2 border-transparent',
                    ].join(' ')}
                  >
                    {h.text}
                  </button>
                )
              })}
            </div>
          </nav>
        </aside>
      )}


      <div className="flex-1 min-w-0 bg-white border border-[#E5E7EB] rounded-2xl p-7">
        <h1 className="font-[Syne] text-2xl font-extrabold text-[#111827] mb-6">{course.title}</h1>

        {course.lesson_content ? (
          <div
            className="prose prose-sm max-w-none text-[#374151] leading-relaxed
              [&>h2]:font-[Syne] [&>h2]:font-bold [&>h2]:text-xl [&>h2]:text-[#111827] [&>h2]:mt-10 [&>h2]:mb-3 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-[#E5E7EB] [&>h2]:scroll-mt-6
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
          <Dialog>
            <DialogTrigger  className="w-full bg-[#f97316] text-white font-bold py-3 rounded-xl hover:bg-[#ea6a05] transition-colors text-sm disabled:opacity-60">I&apos;ve Finished — Take the Assessment</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  Please move on to the assessment only after you have completed the lesson. You will not be able to return to the lesson once you start the assessment.
                </DialogDescription>
                <div className="flex items-center gap-4 justify-end mt-6">
                  <DialogClose className="border broder-2 bg-transparent px-4 py-3 rounded-lg hover:bg-[#F7F4EE]">Close</DialogClose>
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="bg-[#f97316] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#ea6a05] transition-colors text-sm disabled:opacity-60"
                  >
                    {completing ? 'Saving...' : "Continue to Assessment"}
                  </button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          
        </div>
      </div>
    </div>
  )
}