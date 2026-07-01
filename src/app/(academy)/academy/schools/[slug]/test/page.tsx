'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Question {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  order_index: number
}

interface Result {
  score: number
  totalQuestions: number
  percentage: number
  passed: boolean
}

export default function TestPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [courseTitle, setCourseTitle] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/academy/courses/${slug}`)
      const data = await res.json()
      
      // Lock check first
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

      // Now fetch the test
      const testRes = await fetch(`/api/academy/courses/${slug}/test`)
      const testData = await testRes.json()
      if (testRes.ok) {
        setCourseTitle(testData.course.title)
        setQuestions(testData.questions ?? [])
      }
      setLoading(false)
    }
    fetchData()
  }, [slug])


  function selectAnswer(questionId: string, option: string) {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  async function handleSubmit() {
    if (Object.keys(answers).length < questions.length) {
      toast.error(`Please answer all ${questions.length} questions before submitting.`)
      return
    }

    setSubmitting(true)
    const res = await fetch(`/api/academy/courses/${slug}/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })
    const data = await res.json()
    if (res.ok) {
      setResult(data)
    } else {
      toast.error(data.error || 'Failed to submit assessment')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#01381d] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (result) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
            {result.passed ? '🎉' : '😕'}
          </div>
          <h2 className="font-[Syne] text-2xl font-extrabold text-[#111827] mb-2">
            {result.passed ? 'Congratulations!' : 'Not Quite There Yet'}
          </h2>
          <p className="text-[#6B7280] text-sm mb-4">
            You scored <strong>{result.score}/{result.totalQuestions}</strong> ({result.percentage}%)
          </p>
          {result.passed ? (
            <>
              <p className="text-green-600 text-sm mb-6">You&apos;ve passed and earned your certificate for {courseTitle}.</p>
              <button onClick={() => router.push('/academy/certificates')} className="w-full bg-[#f97316] text-white font-bold py-3 rounded-xl hover:bg-[#ea6a05] transition-colors text-sm">
                View Certificate
              </button>
            </>
          ) : (
            <>
              <p className="text-[#6B7280] text-sm mb-6">You need at least 70% to pass. Review the lesson and try again.</p>
              <div className="flex flex-col gap-2">
                <button onClick={() => router.push(`/academy/schools/${slug}/lesson`)} className="w-full bg-white border border-[#E5E7EB] text-[#111827] font-bold py-3 rounded-xl hover:bg-[#F7F4EE] transition-colors text-sm">
                  Review Lesson
                </button>
                <button onClick={() => { setResult(null); setAnswers({}) }} className="w-full bg-[#01381d] text-white font-bold py-3 rounded-xl hover:bg-[#015b2d] transition-colors text-sm">
                  Retake Assessment
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-7">
        <h1 className="font-[Syne] text-xl font-extrabold text-[#111827] mb-1">{courseTitle} — Assessment</h1>
        <p className="text-[#6B7280] text-sm mb-6">Answer all {questions.length} questions. You need 75% to pass.</p>

        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={q.id} className="pb-6 border-b border-[#E5E7EB] last:border-0 last:pb-0">
              <p className="font-semibold text-[#111827] text-sm mb-3">{i + 1}. {q.question}</p>
              <div className="grid grid-cols-1 gap-2">
                {(['A', 'B', 'C', 'D'] as const).map(opt => {
                  const text = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }[opt]
                  const isSelected = answers[q.id] === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => selectAnswer(q.id, opt)}
                      className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                        isSelected ? 'border-[#f97316] bg-[rgba(249,115,22,0.06)] text-[#111827] font-medium' : 'border-[#E5E7EB] text-[#374151] hover:border-[#d1d5db]'
                      }`}
                    >
                      <span className="font-bold mr-2">{opt}.</span>{text}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full mt-6 bg-[#f97316] text-white font-bold py-3 rounded-xl hover:bg-[#ea6a05] transition-colors text-sm disabled:opacity-60"
        >
          {submitting ? 'Grading...' : 'Submit Assessment'}
        </button>
      </div>
    </div>
  )
}