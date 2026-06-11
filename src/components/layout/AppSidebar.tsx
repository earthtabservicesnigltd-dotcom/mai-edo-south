import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard', href: '/admin' },
  { icon: '🙋', label: 'Volunteers', href: '/admin/volunteers' },
  { icon: '💰', label: 'Donations', href: '/admin/donations' },
  { icon: '💬', label: 'Feedback', href: '/admin/feedback' },
  { icon: '🌍', label: 'Diaspora', href: '/admin/diaspora' },
  { icon: '🎙️', label: 'MAI Listens', href: '/admin/mai-listens' },
]

export function AppSidebar() {

  const {setOpenMobile} = useSidebar()
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    toast.success('Logged out')
    router.push('/admin/login')
  }

  const handleNavClick = () => setOpenMobile(false);
  return (
    <Sidebar className="">
      <SidebarHeader className="bg-[#01381d] ">
        <div className="px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Image src="/image_4.png" alt="MAI Logo" width={40} height={40} className="h-10 w-auto" />
            <div>
              <p className="text-white font-black text-base leading-none">MAI</p>
              <p className="text-white/50 text-[0.65rem] tracking-widest uppercase">Admin Portal</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-[#01381d] ">
        <nav className="px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[#f97316] text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                onClick={handleNavClick}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 bg-[#01381d] ">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors w-full"
        >
          <span className="text-base">🚪</span>
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
