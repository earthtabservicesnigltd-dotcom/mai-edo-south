'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSidebar } from '@/components/ui/sidebar'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function StudentDetailPage() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    fetch(`/api/admin/academy/users/${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
  if (!data) return <p className="text-ink-muted text-sm text-center py-12">User not found.</p>

  const { profile, enrollments, progress, certificates } = data

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/academy/users" className="text-[#f97316] text-sm font-semibold hover:underline mb-2 inline-block">← Back to Students</Link>
          <h1 className="font-heading text-4xl text-[#01381d]">{profile.first_name} {profile.last_name}</h1>
          <p className="text-ink-muted text-sm mt-1">{profile.email}</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6">
          <div className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-1">Enrolled</div>
          <div className="font-heading text-3xl text-[#01381d]">{enrollments.length}</div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-1">Courses Passed</div>
          <div className="font-heading text-3xl text-[#01381d]">{progress.filter((p: any) => p.passed).length}/{progress.length}</div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-1">Certificates</div>
          <div className="font-heading text-3xl text-[#01381d]">{certificates.length}</div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-1">Joined</div>
          <div className="font-heading text-xl text-[#01381d] mt-1">
            {new Date(profile.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </CardContent></Card>
      </div>

      {/* Progress per course */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">COURSE PROGRESS</CardTitle></CardHeader>
        <CardContent>
          {progress.length === 0 ? (
            <p className="text-ink-muted text-sm text-center py-8">No progress yet.</p>
          ) : (
            <div className="space-y-4">
              {progress.map((p: any) => (
                <div key={p.id} className="border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-sm">{p.academy_courses?.title}</span>
                      <span className="text-ink-muted text-xs ml-2">({p.academy_courses?.short_label})</span>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                      p.passed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>{p.passed ? 'Passed' : 'In Progress'}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-xs text-ink-muted">
                    <div><span className="font-semibold text-[#111827]">Lesson:</span> {p.lesson_completed ? '✅' : '❌'}</div>
                    <div><span className="font-semibold text-[#111827]">Best Score:</span> {p.best_score ?? '—'}/{p.total_questions ?? '—'}</div>
                    <div><span className="font-semibold text-[#111827]">Attempts:</span> {p.test_attempts ?? 0}</div>
                    <div><span className="font-semibold text-[#111827]">Passed:</span> {p.passed_at ? new Date(p.passed_at).toLocaleDateString() : '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enrollments */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">ENROLLMENTS</CardTitle></CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <p className="text-ink-muted text-sm text-center py-8">Not enrolled in any courses.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Course', 'Code', 'Enrolled Date'].map(h => (
                      <th key={h} className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e: any) => (
                    <tr key={e.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-2 font-semibold">{e.academy_courses?.title}</td>
                      <td className="py-3 px-2 text-ink-muted">{e.academy_courses?.short_label}</td>
                      <td className="py-3 px-2 text-ink-muted">{new Date(e.enrolled_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">CERTIFICATES</CardTitle></CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <p className="text-ink-muted text-sm text-center py-8">No certificates yet.</p>
          ) : (
            <div className="space-y-3">
              {certificates.map((c: any) => (
                <div key={c.id} className="border border-border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{c.academy_courses?.title}</div>
                    <div className="text-ink-muted text-xs">{c.certificate_id}</div>
                  </div>
                  <span className="text-xs text-ink-muted">
                    {new Date(c.issued_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
