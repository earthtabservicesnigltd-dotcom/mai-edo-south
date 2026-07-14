'use client'

import { useEffect, useState } from 'react'

interface Task {
  id: string
  title: string
  description: string
  school_slug: string
  type_label: string
  type_icon: string
  day: string
  urgency_label: string
  done: boolean
  created_at: string
}

const SCHOOL_NAMES: Record<string, string> = {
  'school-of-politics-policy-governance': 'Politics & Governance',
  'school-of-leadership-management': 'Leadership & Management',
  'school-of-business-entrepreneurship': 'Business & Entrepreneurship',
  'school-of-public-service': 'Public Service & Civic Delivery',
  'school-of-technology-digital-skills': 'Technology & Digital Skills',
  'school-of-ai-machine-learning': 'AI & Machine Learning',
}

const WHATSAPP_LINKS: Record<string, string> = {
  'school-of-politics-policy-governance': 'https://chat.whatsapp.com/JYgL3SjhXj49SruHVSvZiy',
  'school-of-leadership-management': 'https://chat.whatsapp.com/HVgzNNSOy9KKSxYDsXEYYB',
  'school-of-business-entrepreneurship': 'https://chat.whatsapp.com/KdI5NUguLfs1TC8wu1AZbj',
  'school-of-public-service': 'https://chat.whatsapp.com/D7lL0CYsTAVIEqeIcTiFlY',
  'school-of-technology-digital-skills': 'https://chat.whatsapp.com/CkbNUDLDxj90SFo1yqFkiv',
  'school-of-ai-machine-learning': 'https://chat.whatsapp.com/BnUsyl90PrOLCim49p9Bz9',
}

const URGENCY_STYLES: Record<string, string> = {
  'Overdue': 'bg-[#fcebeb] text-[#791f1f]',
  'Due today': 'bg-[#faeeda] text-[#633806]',
  'Tomorrow': 'bg-[#F7F4EE] text-[#6B7280]',
  'Thu': 'bg-[#F7F4EE] text-[#6B7280]',
  'Fri': 'bg-[#F7F4EE] text-[#6B7280]',
}

export default function AssignmentsPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [doneSet, setDoneSet] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [schoolSlug, setSchoolSlug] = useState('')

  useEffect(() => {
    fetch('/api/academy/tasks')
      .then(r => r.json())
      .then(d => {
        setTasks(d.tasks ?? [])
        if (d.school_slug) setSchoolSlug(d.school_slug)
        setLoading(false)
      })
  }, [])


  const toggle = (id: string) => {
    setDoneSet(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const groups: Record<string, Task[]> = {}
  tasks.forEach(t => {
    const day = t.day || 'Other'
    if (!groups[day]) groups[day] = []
    groups[day].push(t)
  })
  const dayOrder = ['Overdue', 'Today', 'Tomorrow', 'This week', 'Other']

  const summaries = [
    { icon: 'ti-calendar-due', iconBg: '#faeeda', iconColor: '#854f0b', label: 'Due this week', val: tasks.filter(t => t.day === 'This week').length.toString() },
    { icon: 'ti-alert-circle', iconBg: '#fcebeb', iconColor: '#791f1f', label: 'Overdue', val: tasks.filter(t => t.day === 'Overdue').length.toString() },
    { icon: 'ti-circle-check', iconBg: '#e1f5ee', iconColor: '#0f6e56', label: 'Completed', val: doneSet.size.toString() },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#01381d] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {summaries.map((s, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3 hover:shadow transition-all">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ background: s.iconBg, color: s.iconColor }}>
              <i className={`ti ${s.icon}`} />
            </div>
            <div>
              <div className="text-[11px] text-[#6B7280] uppercase tracking-[0.05em] font-medium">{s.label}</div>
              <div className="font-[Syne] text-2xl font-extrabold text-[#111827]">{s.val}</div>
            </div>
          </div>
        ))}
      </div>

        {/* School WhatsApp Link */}
        {schoolSlug && WHATSAPP_LINKS[schoolSlug] && (
          <a href={WHATSAPP_LINKS[schoolSlug]} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-5 hover:bg-green-100 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-xl shrink-0">
              <i className="ti ti-brand-whatsapp text-[#25D366]" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-green-700 font-bold uppercase tracking-wider mb-0.5">WhatsApp Group</div>
              <div className="text-[13px] font-semibold text-green-900">{SCHOOL_NAMES[schoolSlug]}</div>
            </div>
            <i className="ti ti-external-link text-green-500 group-hover:translate-x-0.5 transition-transform" />
          </a>
        )}


      {/* Task list */}
      {dayOrder.map(day => {
        const dayTasks = groups[day]
        if (!dayTasks) return null
        return (
          <div key={day} className="mb-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-2.5 flex items-center gap-2.5">
              {day}
              <span className="flex-1 h-px bg-[#E5E7EB]" />
            </div>
            <div className="flex flex-col gap-2">
              {dayTasks.map(t => {
                const done = doneSet.has(t.id)
                const schoolName = SCHOOL_NAMES[t.school_slug] || t.school_slug
                return (
                  <div key={t.id}
                    className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex gap-3 hover:border-[rgba(249,115,22,0.4)] hover:shadow transition-all">
                    <button onClick={() => toggle(t.id)}
                      className={`w-[19px] h-[19px] mt-0.5 rounded-[5px] border-[1.5px] flex items-center justify-center shrink-0 cursor-pointer transition-all
                        ${done ? 'bg-green-100 border-transparent text-green-700' : 'border-[#D1D5DB] bg-white hover:border-[#f97316]'}`}>
                      {done && <i className="ti ti-check text-[10px]" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] font-medium mb-1 ${done ? 'line-through text-[#9CA3AF]' : 'text-[#111827]'}`}>
                        {t.title}
                      </div>
                      <div className="text-[12px] text-[#6B7280] font-light leading-relaxed mb-2.5">{t.description}</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold px-2.5 py-[3px] rounded bg-[#e6f1fb] text-[#0c447c]">
                          {schoolName}
                        </span>
                        <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
                          <i className={`ti ${t.type_icon || 'ti-file'} text-xs`} /> {t.type_label}
                        </span>
                        <span className={`text-[11px] font-semibold px-2.5 py-[3px] rounded ${
                          done ? 'bg-green-100 text-green-700' : URGENCY_STYLES[t.urgency_label] || 'bg-[#F7F4EE] text-[#6B7280]'
                        }`}>
                          {done ? 'Done ✓' : t.urgency_label}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {tasks.length === 0 && (
        <div className="text-center py-12 text-[#6B7280] text-sm">
          No assignments yet for your school.
        </div>
      )}
    </div>
  )
}
