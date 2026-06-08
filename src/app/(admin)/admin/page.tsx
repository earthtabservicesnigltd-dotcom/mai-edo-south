'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useSidebar } from "@/components/ui/sidebar"

interface Stats {
  volunteers: number
  donations: number
  feedback: number
  pendingVolunteers: number
}

interface RecentVolunteer {
  id: string
  volunteer_id: string
  first_name: string
  last_name: string
  lga: string
  area_of_interest: string
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ volunteers: 0, donations: 0, feedback: 0, pendingVolunteers: 0 })
  const [recentVolunteers, setRecentVolunteers] = useState<RecentVolunteer[]>([])
  const [loading, setLoading] = useState(true)
  const {toggleSidebar } = useSidebar();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      setStats(data.stats)
      setRecentVolunteers(data.recentVolunteers)
      setLoading(false)
    }
    fetchData()
  }, [])

  const STAT_CARDS = [
    { label: 'Total Volunteers', value: stats.volunteers, icon: '🙋', color: 'bg-[#01381d]', href: '/admin/volunteers' },
    { label: 'Pending Approvals', value: stats.pendingVolunteers, icon: '⏳', color: 'bg-[#f97316]', href: '/admin/volunteers?status=pending' },
    { label: 'Total Donations', value: stats.donations, icon: '💰', color: 'bg-[#015b2d]', href: '/admin/donations' },
    { label: 'Feedback Received', value: stats.feedback, icon: '💬', color: 'bg-[#01381d]', href: '/admin/feedback' },
  ]

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
            <h1 className="font-heading text-4xl text-[#01381d]">DASHBOARD</h1>
            <p className="text-ink-muted text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening with the campaign.</p>
        </div>
        <button
              className="lg:hidden p-2 text-gray-700"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
        {/* <SidebarTrigger className="flex lg:hidden font-bold text-[#015b2d] hover:bg-white/10 rounded-lg p-2 [&>svg]:w-9 [&>svg]:h-9" /> */}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_CARDS.map((card, i) => (
          <Link href={card.href} key={i}>
            <Card className="hover:-translate-y-1 transition-transform cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center text-lg`}>
                    {card.icon}
                  </div>
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

      {/* Recent Volunteers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-xl text-[#01381d]">RECENT VOLUNTEERS</CardTitle>
          <Link href="/admin/volunteers" className="text-[#f97316] text-sm font-semibold hover:underline">
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : recentVolunteers.length === 0 ? (
            <p className="text-ink-muted text-sm text-center py-8">No volunteers yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">ID</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">LGA</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVolunteers.map((v) => (
                    <tr key={v.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs text-[#f97316] font-bold">{v.volunteer_id}</td>
                      <td className="py-3 px-2 font-semibold">{v.first_name} {v.last_name}</td>
                      <td className="py-3 px-2 text-ink-muted">{v.lga}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          v.status === 'approved' ? 'bg-green-100 text-green-700' :
                          v.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-ink-muted">
                        {new Date(v.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
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