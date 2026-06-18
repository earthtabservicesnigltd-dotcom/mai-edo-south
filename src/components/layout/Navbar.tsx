'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import {
  ChevronDown,
  UserRound,
  CalendarDays,
  Mail,
  Newspaper,
  Images,
  CalendarCheck,
  HandHeart,
  Heart,
  Users,
  Headphones,
  MessageCircle,
  BarChart2,
  Globe,
  Users2,
  GraduationCap,
  Briefcase,
  BookOpen,
  ScrollText,
  type LucideIcon,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  soon?: boolean
}

type NavGroup =
  | { label: string; items: NavItem[] }
  | { label: string; href: string; icon: LucideIcon }

// ── Constants ────────────────────────────────────────────

const SOCIAL_LINKS = [
  { label: 'Facebook',  icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { label: 'X',         icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 4.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
  { label: 'YouTube',   icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
]

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'HOME',
    href: '/',
    icon: ScrollText,
  },
  {
    label: 'ABOUT',
    items: [
      { label: 'Biography',  href: '/biography', icon: UserRound },
      { label: 'MAI Agenda', href: '/agenda',     icon: CalendarDays },
      { label: 'Contact',    href: '/contact',    icon: Mail },
    ],
  },
  {
    label: 'MANIFESTO',
    href: '/manifesto',
    icon: ScrollText,
  },
  {
    label: 'NEWS & UPDATES',
    items: [
      { label: 'MAI News',        href: '/news',   icon: Newspaper },
      { label: 'Media & Gallery', href: '/media',  icon: Images },
      { label: 'Events',          href: '/events', icon: CalendarCheck },
    ],
  },
  {
    label: 'PARTNER WITH MAI',
    items: [
      { label: 'Volunteer',                  href: '/volunteer',     icon: HandHeart },
      { label: 'Support Group Registration', href: '/support', icon: Users, },
      { label: 'Donate',                     href: '/donate',        icon: Heart },
    ],
  },
  {
    label: 'MAI CONNECT',
    items: [
      { label: 'MAI Listens', href: '/mai-listens', icon: Headphones },
      { label: 'Ask MAI',     href: '/ask-mai',     icon: MessageCircle, soon: true },
      { label: 'MAI Impact',  href: '/mai-impact',  icon: BarChart2,     soon: true },
    ],
  },
  {
    label: 'MAI NETWORKS',
    items: [
      { label: 'MAI Diaspora Network', href: '/diaspora',      icon: Globe },
      { label: 'MAI Women Network',    href: '/women-network', icon: Users2,        soon: true },
      { label: 'MAI Youth Council',    href: '/youth-council', icon: GraduationCap, soon: true },
    ],
  },
  {
    label: 'MAI ACADEMY',
    items: [
      { label: 'Global Skill & Opportunity Hub', href: '/academy/hub',  icon: Briefcase },
      { label: 'Take Our Courses',                        href: '/academy/join', icon: BookOpen },
    ],
  },
]

const LEFT_NAV  = NAV_GROUPS.slice(0, 4)
const RIGHT_NAV = NAV_GROUPS.slice(4)

// ── Desktop dropdown ─────────────────────────────────────

function NavDropdown({
  group,
  pathname,
}: {
  group: NavGroup
  pathname: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Plain link (no dropdown)
  if (!('items' in group)) {
    const isActive = pathname === group.href
    return (
      <Link
        href={group.href}
        className={`h-full flex items-center px-3 text-[11px] font-semibold tracking-widest transition-all relative whitespace-nowrap
          ${isActive
            ? 'text-[#f97316] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#f97316]'
            : 'text-white/75 hover:text-white'
          }`}
      >
        {group.label}
      </Link>
    )
  }

  const isActive = group.items.some(i => pathname === i.href)

  return (
    <div ref={ref} className="relative h-full flex items-center">
      <button
        onClick={() => setOpen(o => !o)}
        className={`h-full flex items-center gap-1 px-3 text-[11px] font-semibold tracking-widest transition-all relative whitespace-nowrap outline-none
          ${isActive
            ? 'text-[#f97316] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#f97316]'
            : 'text-white/75 hover:text-white'
          }`}
      >
        {group.label}
        <ChevronDown
          className={`w-3 h-3 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 bg-white border border-gray-100 shadow-xl rounded-xl p-1 min-w-[220px] z-50 animate-ddIn">
          <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase px-3 py-1.5">
            {group.label}
          </p>
          <div className="w-full h-px bg-gray-100 mb-1" />
          {group.items.map(item => {
            const Icon = item.icon
            const active = pathname === item.href
            const soon = item.soon

            return (
              <div key={item.href}>
                {soon ? (
                  // Render as non-interactive span — no href, no navigation
                  <span
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-gray-300 cursor-not-allowed select-none"
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0 text-gray-200" />
                    <span className="flex-1">{item.label}</span>
                    <span className="text-[9px] font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded tracking-wider">
                      SOON
                    </span>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors
                      ${active
                        ? 'text-[#f97316] bg-orange-50'
                        : 'text-gray-700 hover:text-[#f97316] hover:bg-gray-50'
                      }`}
                  >
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-[#f97316]' : 'text-gray-400'}`} />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main navbar ──────────────────────────────────────────

export function Navbar() {
  const router   = useRouter()
  const pathname = usePathname()

  const [menuOpen,    setMenuOpen]    = useState(false)
  const [openMobile,  setOpenMobile]  = useState<string | null>(null)
  const [user,        setUser]        = useState<User | null>(null)

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setOpenMobile(null)
  }, [pathname])

  useEffect(() => {
    const supabase = supabaseBrowser()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = supabaseBrowser()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* ── Top bar (desktop only) ── */}
      <div className="hidden lg:block bg-[#01381d] text-white">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">
          <p className="text-[11px] tracking-widest text-white/60 uppercase">
            Driven by Experience · Inspired by the People · Committed to Real Representation
          </p>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(s => (
                <a key={s.label} href="#" aria-label={s.label} className="text-white/50 hover:text-[#f97316] transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
            <div className="w-px h-4 bg-white/20" />
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/account" className="text-[11px] text-white/70 hover:text-white transition-colors">
                  Hello, {user.user_metadata?.first_name?.split(' ')[0] ?? 'Account'}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-[11px] font-semibold text-[#f97316] hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/sign-in" className="text-[11px] text-white/70 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="text-[11px] font-bold bg-[#f97316] text-white px-3 py-1 rounded-md hover:bg-orange-500 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Logo bar (desktop only) ── */}
      <div className="hidden lg:block bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/image_4.png" alt="MAI Logo" width={56} height={56} className="object-contain" />
            <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">Edo South 2027</p>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right hidden xl:block">
              <p className="text-[11px] font-bold text-[#01381d] tracking-widest uppercase">
                Hon. Mathew Aigbuhenze Iduoriyekemwen
              </p>
              <p className="text-[10px] text-gray-400 tracking-wider">
                Senatorial Candidate · Edo South Senatorial District
              </p>
            </div>
            <div className="w-px h-10 bg-gray-200 hidden xl:block" />
            <div className="bg-[#f97316]/10 border border-[#f97316]/30 rounded-lg px-4 py-2 text-center flex items-center gap-1">
              <p className="text-[10px] font-bold text-[#f97316] tracking-[0.25em] uppercase">The Time Is</p>
              <p className="font-heading text-[#01381d] text-lg tracking-widest">MAI</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop nav links ── */}
      <nav className="hidden lg:block bg-[#01381d] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-around h-11">
          <ul className="flex items-center h-full gap-4">
            {LEFT_NAV.map(group => (
              <li key={group.label} className="h-full">
                <NavDropdown group={group} pathname={pathname} />
              </li>
            ))}
          </ul>
          <div className="w-px h-5 bg-white/20" />
          <ul className="flex items-center h-full gap-4">
            {RIGHT_NAV.map(group => (
              <li key={group.label} className="h-full">
                <NavDropdown group={group} pathname={pathname} />
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── Mobile nav ── */}
      <nav className="lg:hidden bg-[#01381d] sticky top-0 z-50 shadow-md">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/image_4.png" alt="MAI Logo" width={40} height={40} className="object-contain" />
            <div>
              <p className="font-heading text-white text-base leading-none tracking-widest">MAI</p>
              <p className="text-[9px] text-white/50 tracking-widest uppercase">Edo South 2027</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/account" className="text-[11px] text-white/70 hover:text-white transition-colors">
                  {user.user_metadata?.first_name?.split(' ')[0] ?? 'Account'}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-[11px] font-semibold text-[#f97316]"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/sign-up"
                className="text-[11px] font-bold bg-[#f97316] text-white px-3 py-1.5 rounded-lg"
              >
                Sign Up
              </Link>
            )}
            <button
              className="p-1.5 text-white/80 hover:text-white transition-colors"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="bg-[#012d17] border-t border-white/10 px-4 py-3 max-h-[80vh] overflow-y-auto">
            {NAV_GROUPS.map(group => (
              <div key={group.label}>
                {'items' in group ? (
                  <div className="border-b border-white/10">
                    <button
                      onClick={() =>
                        setOpenMobile(openMobile === group.label ? null : group.label)
                      }
                      className="w-full flex items-center justify-between py-3 text-[12px] font-semibold tracking-widest text-white/70 hover:text-white transition-colors"
                    >
                      {group.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 opacity-40 transition-transform duration-200
                          ${openMobile === group.label ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {openMobile === group.label && (
                      <div className="pb-2 space-y-1 pl-3">
                        {group.items.map(item => {
                          const Icon = item.icon
                          const soon = item.soon
                          const active = pathname === item.href

                          return soon ? (
                            // Non-interactive — no Link, no navigation
                            <span
                              key={item.href}
                              className="flex items-center gap-2.5 py-2 text-[11px] font-semibold tracking-wider text-white/30 cursor-not-allowed select-none"
                            >
                              <Icon className="w-3.5 h-3.5 flex-shrink-0 text-white/20" />
                              <span className="flex-1">{item.label}</span>
                              <span className="text-[9px] font-bold bg-white/10 text-white/30 px-1.5 py-0.5 rounded tracking-wider">
                                SOON
                              </span>
                            </span>
                          ) : (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMenuOpen(false)}
                              className={`flex items-center gap-2.5 py-2 text-[11px] font-semibold tracking-wider transition-colors
                                ${active ? 'text-[#f97316]' : 'text-white/60 hover:text-white'}`}
                            >
                              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-[#f97316]' : 'text-white/40'}`} />
                              <span className="flex-1">{item.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  // Plain link (Manifesto)
                  <Link
                    href={group.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center py-3 border-b border-white/10 text-[12px] font-semibold tracking-widest transition-colors
                      ${pathname === group.href ? 'text-[#f97316]' : 'text-white/70 hover:text-white'}`}
                  >
                    {group.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Auth buttons */}
            {!user && (
              <div className="flex gap-3 mt-4 pb-1">
                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-[12px] font-bold py-2.5 rounded-lg border border-[#f97316] text-[#f97316] hover:bg-[#f97316] hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-[12px] font-bold py-2.5 rounded-lg bg-[#f97316] text-white hover:bg-orange-500 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Social icons */}
            <div className="flex items-center justify-center gap-5 mt-4 pt-3 border-t border-white/10">
              {SOCIAL_LINKS.map(s => (
                <a key={s.label} href="#" aria-label={s.label} className="text-white/40 hover:text-[#f97316] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Dropdown animation — add to your globals.css if not already there:
          @keyframes ddIn { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:translateY(0) } }
          .animate-ddIn { animation: ddIn 0.18s ease; }
      */}
    </>
  )
}