'use client'

import { useState } from 'react'
import { TASKS, Task } from '@/lib/constant'

export default function AssignmentsPage() {
  const [doneSet, setDoneSet] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState('all')

  const toggle = (id: number) => {
    setDoneSet(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = filter === 'all' ? TASKS : TASKS.filter(t => t.school === filter)
  const groups: Record<string, Task[]> = {}
  filtered.forEach(t => { if (!groups[t.day]) groups[t.day] = []; groups[t.day].push(t) })
  const dayOrder = ['Overdue', 'Today', 'Tomorrow', 'This week']

  const tagStyles: Record<string, string> = {
    'tag-blue': 'bg-[#e6f1fb] text-[#0c447c]',
    'tag-teal': 'bg-[#e1f5ee] text-[#085041]',
    'tag-amber': 'bg-[#faeeda] text-[#633806]',
  }
  const urgencyStyles: Record<string, string> = {
    urgent: 'bg-[#fcebeb] text-[#791f1f]',
    today: 'bg-[#faeeda] text-[#633806]',
    upcoming: 'bg-[#F7F4EE] text-[#6B7280]',
  }

  const summaries = [
    { icon: 'ti-calendar-due', iconBg: '#faeeda', iconColor: '#854f0b', label: 'Due this week', val: '7' },
    { icon: 'ti-alert-circle', iconBg: '#fcebeb', iconColor: '#791f1f', label: 'Overdue', val: '2' },
    { icon: 'ti-circle-check', iconBg: '#e1f5ee', iconColor: '#0f6e56', label: 'Completed', val: `${doneSet.size}` },
  ]

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {summaries.map((s, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3 hover:border-[rgba(249,115,22,0.3)] hover:shadow-[0_2px_16px_rgba(1,56,29,0.07)] transition-all">
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

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { key: 'all', label: 'All schools' },
          { key: 'ppg', label: 'Politics & Governance' },
          { key: 'lm', label: 'Leadership & Management' },
          { key: 'be', label: 'Business & Entrepreneurship' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`text-[12px] font-medium px-3.5 py-2 rounded-full border cursor-pointer transition-all
              ${filter === f.key
                ? 'bg-[#f97316] text-white border-[#f97316] font-semibold'
                : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F7F4EE] hover:text-[#111827]'}`}>
            {f.label}
          </button>
        ))}
      </div>

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
                return (
                  <div key={t.id}
                    className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex gap-3 hover:border-[rgba(249,115,22,0.4)] hover:shadow-[0_2px_16px_rgba(1,56,29,0.07)] transition-all">
                    <button onClick={() => toggle(t.id)}
                      className={`w-[19px] h-[19px] mt-0.5 rounded-[5px] border-[1.5px] flex items-center justify-center shrink-0 cursor-pointer transition-all
                        ${done ? 'bg-green-100 border-transparent text-green-700' : 'border-[#D1D5DB] bg-white hover:border-[#f97316]'}`}>
                      {done && <i className="ti ti-check text-[10px]" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] font-medium mb-1 ${done ? 'line-through text-[#9CA3AF]' : 'text-[#111827]'}`}>
                        {t.title}
                      </div>
                      <div className="text-[12px] text-[#6B7280] font-light leading-relaxed mb-2.5">{t.desc}</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[11px] font-semibold px-2.5 py-[3px] rounded ${tagStyles[t.tagClass] || ''}`}>
                          {t.schoolLabel}
                        </span>
                        <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
                          <i className={`ti ${t.typeIcon} text-xs`} /> {t.typeLabel}
                        </span>
                        <span className={`text-[11px] font-semibold px-2.5 py-[3px] rounded ${
                          done ? 'bg-green-100 text-green-700' : urgencyStyles[t.urgencyClass] || ''
                        }`}>
                          {done ? 'Done ✓' : t.urgencyLabel}
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

      {/* Help button */}
      <div className="text-center mt-6">
        <button className="inline-flex items-center gap-1.5 bg-[#f97316] text-white text-[12px] font-semibold px-5 py-2.5 rounded-lg border-none cursor-pointer hover:bg-[#ea6a05] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(249,115,22,0.3)] transition-all">
          <i className="ti ti-sparkles text-sm" /> Help me with an assignment
        </button>
      </div>
    </div>
  )
}
