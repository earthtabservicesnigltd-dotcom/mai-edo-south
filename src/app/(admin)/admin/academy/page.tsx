'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSidebar } from '@/components/ui/sidebar'
import Link from 'next/link'

interface Stats {
  totalUsers: number
  activeCourses: number
  totalEnrollments: number
  totalCertificates: number
  passedCourses: number
}

interface Enrollment {
  id: string
  enrolled_at: string
  profiles: { first_name: string; last_name: string; email: string }
  academy_courses: { title: string; short_label: string }
}

export default function AcademyAdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, activeCourses: 0, totalEnrollments: 0, totalCertificates: 0, passedCourses: 0,
  })
  const [recentEnrollments, setRecentEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/admin/academy/stats')
      const data = await res.json()
      setStats(data.stats)
      setRecentEnrollments(data.recentEnrollments ?? [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const STAT_CARDS = [
    { label: 'Total Users',      value: stats.totalUsers,      icon: '👥', color: 'bg-[#01381d]', href: '/admin/academy/users' },
    { label: 'Active Courses',   value: stats.activeCourses,   icon: '📚', color: 'bg-[#015b2d]', href: '/admin/academy/courses' },
    { label: 'Enrollments',      value: stats.totalEnrollments, icon: '📝', color: 'bg-[#01381d]', href: '#' },
    { label: 'Certificates',     value: stats.totalCertificates, icon: '🎓', color: 'bg-[#015b2d]', href: '#' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">ACADEMY</h1>
          <p className="text-ink-muted text-sm mt-1">Manage courses, users, and academy content.</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_CARDS.map((card, i) => (
          <Link href={card.href} key={i}>
            <Card className="hover:-translate-y-1 transition-transform cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center text-lg`}>{card.icon}</div>
                  {loading ? (
                    <div className="w-10 h-8 bg-gray-100 rounded animate-pulse" />
                  ) : (
                    <span className="font-heading text-3xl text-[#01381d]">{card.value}</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-ink-muted">{card.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Enrollments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-xl text-[#01381d]">RECENT ENROLLMENTS</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : recentEnrollments.length === 0 ? (
            <p className="text-ink-muted text-sm text-center py-8">No enrollments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Name', 'Email', 'Course', 'Date'].map(h => (
                      <th key={h} className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentEnrollments.map((e: any) => (
                    <tr key={e.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 font-semibold">{e.profiles?.first_name} {e.profiles?.last_name}</td>
                      <td className="py-3 px-2 text-ink-muted">{e.profiles?.email}</td>
                      <td className="py-3 px-2 text-ink-muted">{e.academy_courses?.title}</td>
                      <td className="py-3 px-2 text-ink-muted">
                        {new Date(e.enrolled_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
