'use client'

import { useState, useEffect } from 'react'
import { Panel } from '@/components/ui/shared'

interface Notification {
  id: string
  title: string
  body: string
  icon: string
  bg_color: string
  icon_color: string
  created_at: string
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unread, setUnread] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/academy/notifications')
      .then(r => r.json())
      .then(d => {
        setNotifs(d.notifications ?? [])
        // Mark first 2 as unread
        const unreadIds = new Set<string>((d.notifications ?? []).slice(0, 2).map((n: any) => n.id))
        setUnread(unreadIds)
        setLoading(false)
      })
  }, [])

  const markAllRead = () => setUnread(new Set())

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px] text-[#6B7280] font-light">
          Updates on your tasks, groups, and certificates.
          {unread.size > 0 && <span className="ml-2 text-[11px] font-semibold text-[#f97316]">({unread.size} new)</span>}
        </p>
        <button onClick={markAllRead}
          className="text-[12px] font-medium px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] cursor-pointer hover:bg-[#F7F4EE] transition-colors">
          Mark all as read
        </button>
      </div>

      <Panel>
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : notifs.length === 0 ? (
          <div className="text-center py-8 text-[#6B7280] text-sm">
            <i className="ti ti-bell-off text-2xl block mb-2" />
            No notifications
          </div>
        ) : (
          notifs.map((n, i) => (
            <div key={n.id}
              className={`flex items-start gap-3 py-2.5 ${i < notifs.length - 1 ? 'border-b border-[#E5E7EB]' : ''}
                ${unread.has(n.id) ? 'bg-[#F7F4EE] -mx-4 px-4 rounded-lg' : ''}`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5"
                style={{ background: n.bg_color, color: n.icon_color }}>
                <i className={`ti ${n.icon}`} />
              </div>
              <div className="flex-1">
                <div className="text-[12.5px] font-medium text-[#111827]">{n.title}</div>
                {n.body && <div className="text-[11px] text-[#6B7280] font-light mt-0.5">{n.body}</div>}
                <div className="text-[11px] text-[#9CA3AF] font-light mt-0.5">
                  {new Date(n.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </div>
              </div>
              {unread.has(n.id) && <div className="w-2 h-2 rounded-full bg-[#f97316] shrink-0 mt-2" />}
            </div>
          ))
        )}
      </Panel>
    </div>
  )
}
