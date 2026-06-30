'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar } from '../ui/shared';

const NAV_ITEMS = [
  { href: '/academy', icon: 'ti-layout-dashboard', label: 'Dashboard', section: 'main' },
  { href: '/academy/schools', icon: 'ti-book-2', label: 'My Schools', section: 'main' },
  { href: '/academy/schedule', icon: 'ti-calendar-week', label: 'Weekly Schedule', section: 'main' },
  { href: '/academy/assignments', icon: 'ti-clipboard-list', label: 'Assignments', section: 'main' },
  { href: '/academy/capstone', icon: 'ti-trophy', label: 'Capstone Projects', section: 'main' },
  { href: '/academy/certificates', icon: 'ti-certificate', label: 'Certificates', section: 'account' },
  { href: '/academy/enroll', icon: 'ti-circle-plus', label: 'Enroll in School', section: 'account' },
  { href: '/academy/mygroup', icon: 'ti-users', label: 'My Group', section: 'account' },
  { href: '/academy/notifications', icon: 'ti-bell', label: 'Notifications', section: 'account' },
  { href: '/academy/settings', icon: 'ti-settings', label: 'Settings', section: 'account' },
] as const

const NOTIF_COUNT = 2

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/academy' ? pathname === '/academy' : pathname.startsWith(href)

  return (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.08] mb-3">
        <div className="flex items-center gap-2.5 font-[Syne] text-[15px] font-extrabold text-white tracking-tight">
          <Image src="/image_4.png" alt="MAI" width={36} height={36} className="rounded-lg" />
          MAI Academy
        </div>
      </div>

      {/* Main nav */}
      <div className="px-3.5 mb-1">
        <div className="text-[9px] text-white/30 uppercase tracking-[0.14em] font-bold px-2 py-2">Main</div>
        {NAV_ITEMS.filter(n => n.section === 'main').map(n => (
          <Link
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13px] font-normal mb-0.5 transition-all relative
              ${isActive(n.href) ? 'bg-[rgba(249,115,22,0.18)] text-[#f97316] font-medium' : 'text-white/55 hover:bg-white/[0.07] hover:text-white/85'}`}
          >
            {isActive(n.href) && <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-sm bg-[#f97316]" />}
            <i className={`ti ${n.icon} text-base`} />
            {n.label}
          </Link>
        ))}
      </div>

      {/* Account nav */}
      <div className="px-3.5 mt-2">
        <div className="text-[9px] text-white/30 uppercase tracking-[0.14em] font-bold px-2 py-2">Account</div>
        {NAV_ITEMS.filter(n => n.section === 'account').map(n => (
          <Link
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13px] font-normal mb-0.5 transition-all relative
              ${isActive(n.href) ? 'bg-[rgba(249,115,22,0.18)] text-[#f97316] font-medium' : 'text-white/55 hover:bg-white/[0.07] hover:text-white/85'}`}
          >
            {isActive(n.href) && <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-sm bg-[#f97316]" />}
            <i className={`ti ${n.icon} text-base`} />
            {n.label}
            {n.href === '/academy/notifications' && NOTIF_COUNT > 0 && (
              <span className="ml-auto bg-[#f97316] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{NOTIF_COUNT}</span>
            )}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto px-5 py-4 border-t border-white/[0.08] flex items-center gap-2.5">
        <Avatar initials="EA" size="lg" />
        <div className="text-[13px] font-semibold text-white tracking-tight">Emeka Ade</div>
      </div>
    </>
  )
}