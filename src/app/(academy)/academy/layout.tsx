'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarContent } from '@/components/layout/sidebar'
import { Avatar } from '@/components/ui/shared';
import { PAGE_TITLES, PageKey } from '@/lib/constant';

function getPageTitle(pathname: string): string {
  const segment = pathname.split('/').pop() as PageKey
  return PAGE_TITLES[segment] ?? PAGE_TITLES['dashboard']
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />

      <div className="flex min-h-screen bg-[#f0ede6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-[240px] shrink-0 bg-[#01381d] flex-col sticky top-0 h-screen overflow-y-auto">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-[240px] bg-[#01381d] flex flex-col overflow-y-auto">
              <SidebarContent onNavigate={() => setSidebarOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Topbar */}
          <div className="bg-white border-b border-[#E5E7EB] px-5 lg:px-7 h-[62px] flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F7F4EE] transition-colors cursor-pointer"
              >
                <i className="ti ti-menu-2 text-base" />
              </button>
              <div>
                <div className="text-[11px] text-[#6B7280] font-light">MAI Academy</div>
                <div className="font-[Syne] text-[17px] font-extrabold text-[#111827] tracking-tight leading-tight">{title}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href="/academy/assignments"
                className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F7F4EE] transition-colors"
              >
                <i className="ti ti-clipboard-list text-sm" /> View tasks
              </Link>
              <Link
                href="/academy/enroll"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-2 rounded-lg bg-[#f97316] text-white hover:bg-[#ea6a05] transition-colors"
              >
                <i className="ti ti-circle-plus text-sm" /> Enroll
              </Link>
              <Link
                href="/academy/notifications"
                className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F7F4EE] transition-colors"
              >
                <i className="ti ti-bell text-base" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#f97316]" />
              </Link>
              <Avatar initials="EA" size="sm" />
            </div>
          </div>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-5 lg:p-7">
              {children}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}