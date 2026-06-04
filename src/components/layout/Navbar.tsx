'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { label: 'HOME',          href: '/' },
  { label: 'ABOUT MAI',     href: '/about' },
  { label: 'MANIFESTO',     href: '/manifesto' },
  { label: 'AGENDA',        href: '/agenda' },
  { label: 'NEWS & UPDATES',href: '/news' },
  { label: 'MEDIA',         href: '/media' },
  { label: 'EVENTS',        href: '/events' },
  { label: 'VOLUNTEER',     href: '/volunteer' },
  { label: 'DONATE',        href: '/donate'},
  { label: 'CONTACT',       href: '/contact' },
]

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({data}) => setUser(data.user));
    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    })
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#01381d] text-white text-[13px] py-0 md:py-2.5 px-0 md:px-4">
        <div className="max-w-7xl mx-auto hidden md:flex items-center justify-between">
          <span className="hidden sm:block">
            Driven by Experience, Inspired by the People and Committed to Real Representation.
          </span>
          <div className="flex items-center gap-4 ml-auto">
            {[
              { href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { href: '#', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 4.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { href: '#', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
              { href: '#', icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
            ].map((s, i) => (
              <a key={i} href={s.href} className="text-white hover:text-[#f97316] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d={s.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-[#F7F7F7] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/image_4.png"
              alt="MAI Logo"
              width={60}
              height={60}
              className="object-contain"
            />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-[0.72rem] font-semibold px-3 py-1.5 transition-colors hover:text-[#f97316] ${
                    pathname === link.href
                      ? 'text-[#f97316] border-b-2 border-[#f97316]'
                      : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Donate button + mobile toggle */}
          <div className="flex items-center gap-2">
            {user ? (
                <>
                  <Link
                    href="/account"
                    className="text-[12px] font-medium text-gray-700 hover:text-[#f97316] transition-colors"
                  >
                    Hello, {user.user_metadata?.first_name?.split(' ')[0] ?? 'Account'}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-[12px] font-semibold text-[#f97316] cursor-pointer border border-[#f97316] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Sign out
                  </button>
                </>
            ) : (
              <>
                 <Link
                  href="/sign-in"
                  className="hidden lg:block mt-3 text-[#f97316] bg-white border-2 border-[#f97316] text-center font-bold py-2.5 px-4 rounded-[10px] hover:bg-[#f97316] hover:text-white active:scale-95 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="hidden lg:block mt-3 bg-[#f97316] text-white text-center font-bold py-2.5 px-4 rounded-[10px] hover:bg-[#015b2d] hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          
            <button
              className="lg:hidden p-2 text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
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

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm font-semibold py-2.5 border-b border-gray-100 transition-colors hover:text-[#f97316] ${
                  pathname === link.href ? 'text-[#f97316]' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
           <Link
            href="/sign-in"
            className="block mt-3 text-[#f97316] bg-white border-2 border-[#f97316] text-center font-bold py-2.5 px-4 rounded-[10px] hover:bg-[#f97316] hover:text-white active:scale-95 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="block mt-3 bg-[#f97316] text-white text-center font-bold py-2.5 px-4 rounded-[10px] hover:bg-[#015b2d] hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Sign Up
          </Link>
          </div>
        )}
      </nav>
    </>
  )
}