'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { SidebarContent } from '@/components/layout/sidebar'
import { PAGE_TITLES, PageKey } from '@/lib/constant'
import { supabaseBrowser } from '@/lib/supabase'

function getPageTitle(pathname: string): string {
  const segment = pathname.split('/').pop() as PageKey
  return PAGE_TITLES[segment] ?? PAGE_TITLES['dashboard']
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [checking, setChecking] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const title = getPageTitle(pathname)

  const isPublicRoute = pathname === '/start'

  useEffect(() => {
    if (isPublicRoute) {
      setChecking(false)
      return
    }
    async function checkAuth() {
      try {
        const supabase = supabaseBrowser()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
          console.error('Auth check failed:', error.message)
          router.push(`/academic-auth`)
          return
        }

        if (!user) {
          router.push(`/academic-auth`)
          return
        }

        setChecking(false)
      } catch (err) {
        console.error('Supabase unreachable:', err)
        router.push(`/academic-auth`)
      }
    }
    checkAuth()
  }, [pathname, isPublicRoute, router])

  if (isPublicRoute) {
    return <>{children}</>
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0ede6]">
        <div className="w-8 h-8 border-3 border-[#01381d] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />

      <div className="flex h-screen bg-[#f0ede6] overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        <aside className="hidden lg:flex w-[240px] shrink-0 bg-[#01381d] flex-col overflow-y-auto">
          <SidebarContent />
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-[240px] bg-[#01381d] flex flex-col overflow-y-auto">
              <SidebarContent onNavigate={() => setSidebarOpen(false)} />
            </aside>
          </div>
        )}

        <div className="flex-1 flex flex-col min-h-0 min-w-0">

          {/* Fixed header — outside scroll area */}
          <div className="bg-white border-b border-[#E5E7EB] px-5 lg:px-7 h-[62px] flex items-center justify-between shrink-0 z-10">
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
              <button
                onClick={async () => {
                  const supabase = supabaseBrowser()
                  await supabase.auth.signOut()
                  router.push('/')
                }}
                className="text-[12px] font-medium px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white text-red-500 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Scroll container — TOC sticky + scroll spy use this */}
          <div className="flex-1 min-h-0 overflow-y-auto" data-academy-scroll>
            <div className="max-w-6xl mx-auto p-5 lg:p-7">
              {children}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}