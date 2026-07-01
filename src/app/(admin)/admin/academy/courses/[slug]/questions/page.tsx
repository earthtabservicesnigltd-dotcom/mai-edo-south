'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'

interface Question {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  order_index: number
}

export default function QuestionsAdminPage() {
  const { slug } = useParams()
  const [course, setCourse] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', order_index: 0 })
  const { toggleSidebar } = useSidebar()

  useEffect(() => { fetchQuestions() }, [])

  async function fetchQuestions() {
    const res = await fetch(`/api/admin/academy/courses/${slug}/questions`)
    const data = await res.json()
    setCourse(data.course)
    setQuestions(data.questions ?? [])
    setLoading(false)
  }

  async function saveQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!form.question) return toast.error('Question is required')
    const res = await fetch(`/api/admin/academy/courses/${slug}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : { ...form, order_index: questions.length + 1 }),
    })
    if (res.ok) { toast.success(editingId ? 'Question updated' : 'Question added'); fetchQuestions(); resetForm() }
    else toast.error('Failed to save')
  }

  async function deleteQuestion(id: string) {
    await fetch(`/api/admin/academy/courses/${slug}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deleteId: id }),
    })
    toast.success('Question deleted'); fetchQuestions()
  }

  function editQuestion(q: Question) {
    setEditingId(q.id)
    setForm({ question: q.question, option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d, correct_answer: q.correct_answer, order_index: q.order_index })
  }

  function resetForm() {
    setEditingId(null)
    setForm({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', order_index: 0 })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">QUESTIONS</h1>
          <p className="text-ink-muted text-sm mt-1">{course?.title} — {questions.length} questions</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {/* Add/Edit Form */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">{editingId ? 'Edit Question' : 'Add Question'}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={saveQuestion} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Question</label>
              <textarea value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} className="field w-full px-3 py-2 rounded-lg border border-border text-sm" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['A', 'B', 'C', 'D'].map(opt => (
                <div key={opt}>
                  <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Option {opt}</label>
                  <div className="flex gap-2 items-center">
                    <input value={(form as any)[`option_${opt.toLowerCase()}`]} onChange={e => setForm(f => ({ ...f, [`option_${opt.toLowerCase()}`]: e.target.value }))}
                      className="field flex-1 px-3 py-2 rounded-lg border border-border text-sm" />
                    <input type="radio" name="correct" value={opt} checked={form.correct_answer === opt}
                      onChange={e => setForm(f => ({ ...f, correct_answer: e.target.value }))} className="accent-[#01381d]" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-[#01381d] text-white text-xs font-bold rounded-xl hover:bg-[#015b2d] transition-colors">{editingId ? 'Update' : 'Add'} Question</button>
              {editingId && <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200">Cancel</button>}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : questions.length === 0 ? (
            <p className="text-ink-muted text-sm text-center py-8">No questions yet.</p>
          ) : (
            <div className="space-y-4">
              {questions.map((q, i) => (
                <div key={q.id} className="border border-border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-2"><span className="text-[#f97316]">Q{i + 1}.</span> {q.question}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {['A', 'B', 'C', 'D'].map(opt => {
                          const text = (q as any)[`option_${opt.toLowerCase()}`]
                          const isCorrect = q.correct_answer === opt
                          return (
                            <div key={opt} className={`px-3 py-1.5 rounded-lg border text-xs ${isCorrect ? 'border-green-300 bg-green-50 text-green-700 font-semibold' : 'border-border text-ink-muted'}`}>
                              <span className="font-bold mr-1">{opt}.</span> {text} {isCorrect && '✓'}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => editQuestion(q)} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200">Edit</button>
                      <button onClick={() => deleteQuestion(q.id)} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
