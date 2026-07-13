'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'

const NAV_ITEMS = [
  { href: '/academy', icon: 'ti-layout-dashboard', label: 'Dashboard', section: 'main' },
  { href: '/academy/schools', icon: 'ti-book-2', label: 'My Schools', section: 'main' },
  { href: '/academy/schedule', icon: 'ti-calendar-week', label: 'Daily Schedule', section: 'main' },
  { href: '/academy/assignments', icon: 'ti-clipboard-list', label: 'Assignments', section: 'main' },
  { href: '/academy/capstone', icon: 'ti-trophy', label: 'Capstone Projects', section: 'main' },
  { href: '/academy/certificates', icon: 'ti-certificate', label: 'Certificates', section: 'account' },
  { href: '/academy/mygroup', icon: 'ti-users', label: 'My Group', section: 'account' },
  { href: '/academy/notifications', icon: 'ti-bell', label: 'Notifications', section: 'account' },
  { href: '/academy/settings', icon: 'ti-settings', label: 'Settings', section: 'account' },
] as const


export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({ first_name: '', last_name: '' })
  const [notifCount, setNotifCount] = useState(0)

  useEffect(() => {
    fetch('/api/academy/notifications')
      .then(r => r.json())
      .then(d => setNotifCount(d.notifications?.length ?? 0))
      .catch(() => {})
  }, [])


  useEffect(() => {
    const supabase = supabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        const firstName = data.user.user_metadata?.first_name || ''
        const lastName = data.user.user_metadata?.last_name || ''
        setProfile({ first_name: firstName, last_name: lastName })
      }
    })
  }, [])

  const initials = `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}`.toUpperCase() || '?'
  const displayName = [profile.first_name].filter(Boolean).join(' ') || 'Account'

  const isActive = (href: string) =>
    href === '/academy' ? pathname === '/academy' : pathname.startsWith(href)

  return (
    <>
      {/* Logo */}
      <div className="px-5 py-2 border-b border-white/[0.08] mb-3">
        <div className="relative z-10">
          <Image src="/image_4.png" alt="MAI Logo" width={70} height={40} className="" />
          <div className="inline-block px-4 py-0.5 rounded-full text-[0.6rem] font-bold tracking-[0.2em] whitespace-nowrap uppercase text-[#f97316] bg-[rgba(249,115,22,0.18)] border border-[rgba(249,115,22,0.35)]">Academy Dashboard</div>
        </div>
      </div>

      {/* Main nav */}
      <div className="px-3.5 mb-1">
        <div className="text-[9px] text-white/30 uppercase tracking-[0.14em] font-bold px-2 py-2">Main</div>
        {NAV_ITEMS.filter(n => n.section === 'main').map(n => (
          <Link key={n.href} href={n.href} onClick={onNavigate}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13px] font-normal mb-0.5 transition-all relative
              ${isActive(n.href) ? 'bg-[rgba(249,115,22,0.18)] text-[#f97316] font-medium' : 'text-white/55 hover:bg-white/[0.07] hover:text-white/85'}`}>
            {isActive(n.href) && <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-sm bg-[#f97316]" />}
            <i className={`ti ${n.icon} text-base`} /> {n.label}
          </Link>
        ))}
      </div>

      {/* Account nav */}
      <div className="px-3.5 mt-2">
        <div className="text-[9px] text-white/30 uppercase tracking-[0.14em] font-bold px-2 py-2">Account</div>
        {NAV_ITEMS.filter(n => n.section === 'account').map(n => (
          <Link key={n.href} href={n.href} onClick={onNavigate}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13px] font-normal mb-0.5 transition-all relative
              ${isActive(n.href) ? 'bg-[rgba(249,115,22,0.18)] text-[#f97316] font-medium' : 'text-white/55 hover:bg-white/[0.07] hover:text-white/85'}`}>
            {isActive(n.href) && <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-sm bg-[#f97316]" />}
            <i className={`ti ${n.icon} text-base`} /> {n.label}
            {n.href === '/academy/notifications' && notifCount > 0 && (
              <span className="ml-auto bg-[#f97316] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{notifCount}</span>
            )}
          </Link>
        ))}
      </div>

      {/* Footer — dynamic user */}
      <Link href="/academy/account" className="mt-auto px-5 py-4 border-t border-white/[0.08] flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-[#f97316] flex items-center justify-center text-[12px] font-bold text-white shrink-0">
          {initials}
        </div>
        <div className="text-[13px] font-semibold text-white tracking-tight truncate">{displayName}</div>
      </Link>
    </>
  )
}
