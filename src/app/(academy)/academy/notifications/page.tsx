'use client'

import { useState } from 'react'
import { Panel } from '@/components/ui/shared'
import { NOTIFICATIONS } from '@/lib/constant'

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS.map(n => ({ ...n })))
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })))

  const unreadCount = notifs.filter(n => n.unread).length

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px] text-[#6B7280] font-light">
          Updates on your tasks, groups, and certificates.
          {unreadCount > 0 && (
            <span className="ml-2 text-[11px] font-semibold text-[#f97316]">
              ({unreadCount} unread)
            </span>
          )}
        </p>
        <button onClick={markAllRead}
          className="text-[12px] font-medium px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] cursor-pointer hover:bg-[#F7F4EE] transition-colors">
          Mark all as read
        </button>
      </div>

      <Panel>
        {notifs.length === 0 ? (
          <div className="text-center py-8 text-[#6B7280] text-sm">
            <i className="ti ti-bell-off text-2xl block mb-2" />
            No notifications
          </div>
        ) : (
          notifs.map((n, i) => (
            <div key={i}
              className={`flex items-start gap-3 py-2.5 ${i < notifs.length - 1 ? 'border-b border-[#E5E7EB]' : ''}
                ${n.unread ? 'bg-[#F7F4EE] -mx-4 px-4 rounded-lg' : ''}`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5"
                style={{ background: n.bg, color: n.color }}>
                <i className={`ti ${n.icon}`} />
              </div>
              <div className="flex-1">
                <div className="text-[12.5px] font-medium text-[#111827]">{n.text}</div>
                <div className="text-[11px] text-[#9CA3AF] font-light mt-0.5">{n.time}</div>
              </div>
              {n.unread && <div className="w-2 h-2 rounded-full bg-[#f97316] shrink-0 mt-2" />}
            </div>
          ))
        )}
      </Panel>
    </div>
  )
}
