'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import Link from 'next/link'

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [lockState, setLockState] = useState<Record<string, boolean>>({})
  const { toggleSidebar } = useSidebar()

  useEffect(() => { fetchCourses() }, [])

  async function fetchCourses() {
    const schoolsRes = await fetch('/api/academy/schools')
    const schoolsData = await schoolsRes.json()
    const schools = schoolsData.schools ?? []
    setCourses(schools)

    // Build initial lock state: default all to locked (true)
    const initial: Record<string, boolean> = {}
    schools.forEach((s: any) =>
      (s.courses || []).forEach((c: any) => {
        initial[c.id] = c.assessments_locked ?? true
      })
    )
    setLockState(initial)
    setLoading(false)
  }

  async function toggleAssessment(courseId: string) {
    const newLocked = !lockState[courseId]

    // Update local state immediately (instant feedback)
    setLockState(prev => ({ ...prev, [courseId]: newLocked }))

    // Fire API in background
    const res = await fetch(`/api/admin/academy/courses/toggle-assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, locked: newLocked }),
    })
    if (res.ok) {
      toast.success(`Assessment ${newLocked ? 'locked' : 'opened'}`)
    } else {
      toast.error('Failed to toggle')
    }
  }

  const allCourses = courses.flatMap((s: any) => s.courses || [])
  const filtered = allCourses.filter((c: any) => {
    if (search) {
      const q = search.toLowerCase()
      return c.title?.toLowerCase().includes(q) || c.short_label?.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">COURSES</h1>
          <p className="text-ink-muted text-sm mt-1">View and manage all academy courses.</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="font-heading text-xl text-[#01381d]">
              ALL COURSES <span className="text-ink-muted font-sans text-sm font-normal">({filtered.length})</span>
            </CardTitle>
            <Input placeholder="Search by title or code..." value={search} onChange={e => setSearch(e.target.value)} className="field sm:w-72" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-8">
              {courses.map((school: any) => (
                <div key={school.slug}>
                  <h3 className="font-heading text-lg text-[#01381d] mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ background: school.icon_bg, color: school.icon_color }}>
                      <i className={`ti ${school.icon}`} />
                    </div>
                    {school.title}
                    <span className="text-ink-muted font-sans text-sm font-normal">({school.courses?.length || 0} courses)</span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">#</th>
                          <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Code</th>
                          <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Title</th>
                          <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Instructor</th>
                          <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Certificate</th>
                          <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Status</th>
                          <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Assessment</th>
                          <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Questions</th>
                          <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(school.courses || []).map((c: any, idx: number) => (
                          <tr key={c.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-2 text-ink-muted">{idx + 1}</td>
                            <td className="py-3 px-2 font-mono text-xs text-[#f97316] font-bold">{c.short_label}</td>
                            <td className="py-3 px-2 font-semibold">{c.title}</td>
                            <td className="py-3 px-2 text-ink-muted">{c.instructor_name || '—'}</td>
                            <td className="py-3 px-2 text-ink-muted text-xs max-w-[200px] truncate">{c.certificate_title}</td>
                            <td className="py-3 px-2">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${c.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {c.is_active !== false ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <button
                                onClick={() => toggleAssessment(c.id)}
                                className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
                                  lockState[c.id] === false
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                {lockState[c.id] === false ? 'Lock' : 'Open'}
                              </button>
                            </td>
                            <td className="py-3 px-2">
                              <Link href={`/admin/academy/courses/${c.slug}/questions`} className="text-[#f97316] text-xs font-semibold hover:underline">
                                Manage
                              </Link>
                            </td>
                            <td className="py-3 px-2">
                              <Link href={`/admin/academy/courses/${c.slug}/edit`} className="text-[#f97316] text-xs font-semibold hover:underline">
                                Edit Content
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
