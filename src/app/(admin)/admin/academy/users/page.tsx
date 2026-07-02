'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import Link from 'next/link'

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  created_at: string
  academy_enrollments: any[]
  academy_progress: any[]
  academy_certificates: any[]
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filtered, setFiltered] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/admin/academy/users')
      const data = await res.json()
      setUsers(data.users ?? [])
      setFiltered(data.users ?? [])
      setLoading(false)
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    if (!search) { setFiltered(users); return }
    const q = search.toLowerCase()
    setFiltered(users.filter(u =>
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    ))
  }, [search, users])

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
            <div>
            <h1 className="font-heading text-4xl text-[#01381d]">STUDENTS</h1>
            <p className="text-ink-muted text-sm mt-1">View all enrolled students and their progress.</p>
            </div>
            <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            </button>
        </div>

        <Card>
            <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <CardTitle className="font-heading text-xl text-[#01381d]">
                ALL STUDENTS <span className="text-ink-muted font-sans text-sm font-normal">({filtered.length})</span>
                </CardTitle>
                <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="field sm:w-72" />
            </div>
            </CardHeader>
            <CardContent>
            {loading ? (
                <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
            ) : filtered.length === 0 ? (
                <p className="text-ink-muted text-sm text-center py-12">No students found.</p>
            ) : (
                <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-border">
                        {['Name', 'Email', 'Enrolled', 'Progress', 'Certificates', 'Joined'].map(h => (
                        <th key={h} className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(u => (
                        <tr key={u.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2">
                            <Link href={`/admin/academy/users/${u.id}`} className="font-semibold hover:text-[#f97316] transition-colors">
                            {u.first_name} {u.last_name}
                            </Link>
                        </td>
                        <td className="py-3 px-2 text-ink-muted">{u.email}</td>
                        <td className="py-3 px-2">{u.academy_enrollments?.length || 0}</td>
                        <td className="py-3 px-2">
                            {u.academy_progress?.filter((p: any) => p.passed).length || 0}/{u.academy_progress?.length || 0} passed
                        </td>
                        <td className="py-3 px-2">{u.academy_certificates?.length || 0}</td>
                        <td className="py-3 px-2 text-ink-muted whitespace-nowrap">
                            {new Date(u.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
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
    </>
  )
}
