'use client'

import { useState } from 'react'
import { Panel } from '@/components/ui/shared'
import { NOTIFICATIONS } from '@/lib/constant'

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS.map(n => ({ ...n })))
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })))

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px] text-[#6B7280] font-light">Updates on your tasks, groups, and certificates.</p>
        <button onClick={markAllRead}
          className="text-[12px] font-medium px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] cursor-pointer hover:bg-[#F7F4EE] transition-colors">
          Mark all as read
        </button>
      </div>
      <Panel>
        {notifs.map((n, i) => (
          <div key={i} className={`flex items-start gap-3 py-3 ${i < notifs.length - 1 ? 'border-b border-[#E5E7EB]' : ''} ${n.unread ? 'bg-[#F7F4EE] -mx-4 px-4 rounded-lg' : ''}`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: n.bg, color: n.color }}>
              <i className={`ti ${n.icon}`} />
            </div>
            <div>
              <div className="text-[12.5px] font-medium text-[#111827]">{n.text}</div>
              <div className="text-[11px] text-[#9CA3AF]">{n.time}</div>
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full bg-[#f97316] shrink-0 mt-1.5 ml-auto" />}
          </div>
        ))}
      </Panel>
    </div>
  )
}