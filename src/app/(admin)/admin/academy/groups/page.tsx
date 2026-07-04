'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'

interface Member {
  initials: string
  name: string
  role: string
  task: string
}

export default function GroupsAdminPage() {
  const [groupName, setGroupName] = useState('Group B — Business cohort')
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    fetch('/api/admin/academy/groups')
      .then(r => r.json())
      .then(d => {
        setGroupName(d.group?.name || '')
        setMembers(d.group?.members || [])
        setLoading(false)
      })
  }, [])

  function updateMember(index: number, field: keyof Member, value: string) {
    setMembers(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m))
  }

  function addMember() {
    setMembers(prev => [...prev, { initials: '', name: '', role: 'Member', task: '' }])
  }

  function removeMember(index: number) {
    setMembers(prev => prev.filter((_, i) => i !== index))
  }

  async function save() {
    // Save to constant file — but since we can't write files at runtime,
    // we'll show the code to paste into constant.ts
    const code = `export const GROUP_MEMBERS = ${JSON.stringify(members, null, 2)}`
    navigator.clipboard.writeText(code)
    toast.success('Copied! Paste into @/lib/constant.ts')
  }

  if (loading) return <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><h1 className="font-heading text-4xl text-[#01381d]">MY GROUP</h1><p className="text-ink-muted text-sm mt-1">Manage the group shown to students.</p></div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
      </div>

      <Card>
        <CardHeader><CardTitle>Group Info</CardTitle></CardHeader>
        <CardContent>
          <input value={groupName} onChange={e => setGroupName(e.target.value)}
            className="field w-full px-3 py-2 rounded-lg border border-border text-sm" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Members ({members.length})</CardTitle>
          <button onClick={addMember} className="px-3 py-1.5 bg-[#f97316] text-white text-xs font-bold rounded-lg hover:bg-[#ea6a05]">+ Add</button>
        </CardHeader>
        <CardContent className="space-y-3">
          {members.map((m, i) => (
            <div key={i} className="flex gap-2 items-center border border-border rounded-xl p-3">
              <input value={m.initials} onChange={e => updateMember(i, 'initials', e.target.value)} className="field w-14 px-2 py-1.5 rounded-lg border border-border text-xs text-center" placeholder="EA" />
              <input value={m.name} onChange={e => updateMember(i, 'name', e.target.value)} className="field flex-1 px-2 py-1.5 rounded-lg border border-border text-sm" placeholder="Name" />
              <input value={m.role} onChange={e => updateMember(i, 'role', e.target.value)} className="field w-28 px-2 py-1.5 rounded-lg border border-border text-xs" placeholder="Role" />
              <input value={m.task} onChange={e => updateMember(i, 'task', e.target.value)} className="field flex-1 px-2 py-1.5 rounded-lg border border-border text-xs" placeholder="Working on..." />
              <button onClick={() => removeMember(i)} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200">×</button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button onClick={save} className="px-6 py-2 bg-[#01381d] text-white text-xs font-bold rounded-xl hover:bg-[#015b2d]">
          Save & Copy to Code
        </button>
      </div>
    </div>
  )
}
