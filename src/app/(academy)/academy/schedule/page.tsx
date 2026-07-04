'use client'

import { useEffect, useState } from 'react'
import { Badge, Panel, SectionHead } from '@/components/ui/shared'

interface ScheduleEvent {
  id: string
  day_of_week: number
  day_label: string
  event_title: string
  event_bg: string
  event_color: string
  is_today: boolean
  is_upcoming: boolean
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/academy/schedule')
      .then(r => r.json())
      .then(d => setSchedule(d.schedule ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const days = DAY_NAMES.map((name, dayIndex) => {
    const dayEvents = schedule.filter(e => e.day_of_week === dayIndex)
    return {
      name,
      label: dayEvents[0]?.day_label || '',
      today: dayEvents.some(e => e.is_today),
      events: dayEvents.map(e => ({ bg: e.event_bg, color: e.event_color, text: e.event_title })),
    }
  })

  const upcomingEvents = schedule.filter(e => e.is_upcoming)

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-3 border-[#01381d] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px] text-[#6B7280] font-light">Your week at a glance — Mon to Sat intensive format.</p>
        <Badge variant="orange">Cohort 3 · Week 1</Badge>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
        {days.map((d, i) => (
          <div key={i} className={`bg-white border rounded-xl p-3.5 ${d.today ? 'border-[#f97316]' : 'border-[#E5E7EB]'}`}>
            <div className="text-center pb-2.5 mb-2.5 border-b border-[#E5E7EB]">
              <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{d.name}</div>
              <div className={`font-[Syne] text-[16px] font-extrabold mt-0.5 ${d.today ? 'text-[#f97316]' : 'text-[#111827]'}`}>{d.label}</div>
            </div>
            <div className="flex flex-col gap-1.5">
              {d.events.map((e, ei) => (
                <div key={ei} className="text-[10.5px] leading-snug px-2 py-1.5 rounded" style={{ background: e.bg, color: e.color }}>{e.text}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Section */}
      {upcomingEvents.length > 0 && (
        <>
          <SectionHead title="Upcoming this week" />
          <Panel>
            {upcomingEvents.map((s, i) => (
              <div key={s.id} className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.event_color }} />
                  {i < upcomingEvents.length - 1 && <div className="w-px flex-1 my-1 bg-[#E5E7EB]" />}
                </div>
                <div className={`${i < upcomingEvents.length - 1 ? 'pb-3' : ''} flex-1`}>
                  <div className="text-[12.5px] font-semibold text-[#111827] mb-0.5">{s.event_title}</div>
                  <div className="text-[11px] text-[#6B7280] font-light">{DAY_NAMES[s.day_of_week]} · {s.day_label}</div>
                </div>
              </div>
            ))}
          </Panel>
        </>
      )}

      {/* Fallback if no upcoming */}
      {upcomingEvents.length === 0 && (
        <>
          <SectionHead title="Upcoming this week" />
          <Panel>
            <p className="text-center text-[#6B7280] text-sm py-4">No upcoming events this week.</p>
          </Panel>
        </>
      )}
    </div>
  )
}
