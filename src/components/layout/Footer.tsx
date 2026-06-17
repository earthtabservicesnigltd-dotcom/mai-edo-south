"use client";
import Image from 'next/image'
import Link from 'next/link'
import {usePathname} from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

const NAV_LINK_GROUPS = [
  {
    label: 'HOME',
    items: [
      {label: 'Home', href:'/'},
    ]
  },
  {
    label: 'About',
    items: [
      { label: 'Biography',   href: '/biography' },
      { label: 'MAI Agenda',  href: '/agenda' },
      { label: 'Contact',     href: '/contact' },
    ],
  },
  {
    label: 'Explore',
    items: [
      { label: 'Manifesto',       href: '/manifesto' },
      { label: 'MAI News',        href: '/news' },
      { label: 'Media & Gallery', href: '/media' },
      { label: 'Events',          href: '/events' },
    ],
  },
  {
    label: 'Partner With MAI',
    items: [
      { label: 'Volunteer',  href: '/volunteer' },
      { label: 'Donate',     href: '/donate' },
    ],
  },
  {
    label: 'MAI Connect',
    items: [
      { label: 'MAI Listens', href: '/mai-listens' },
    ],
  },
  {
    label: 'MAI Networks',
    items: [
      { label: 'MAI Diaspora Network', href: '/diaspora' },
    ],
  },
]

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: '#',
    icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'X',
    href: '#',
    icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 4.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'Instagram',
    href: '#',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    label: 'YouTube',
    href: '#',
    icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
]

export function Footer() {
  const pathname = usePathname()
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
      toast.success("You're now subscribed! 🎉", {
        description: 'Thank you for joining the MAI movement. You will receive updates on campaign events, policy announcements, and community development initiatives.'
      });
      setEmail("");
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while subscribing. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="bg-[#01381d] text-white pt-16 pb-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <Image
              src="/image_4.png"
              alt="MAI Logo"
              width={120}
              height={120}
              className="object-contain mb-5"
            />
            <p className="text-gray-300 text-sm leading-relaxed">
              Driven by Experience, Inspired by the People
              and Committed to Real Representation.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="text-white hover:text-[#f97316] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links — grouped columns */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-base mb-5 uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
              {NAV_LINK_GROUPS.map(group => (
                <div key={group.label}>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[#f97316] mb-2">
                    {group.label}
                  </p>
                  <ul className="space-y-2">
                    {group.items.map(link => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`text-sm transition-colors ${
                            pathname === link.href
                              ? 'text-[#f97316]'
                              : 'text-gray-300 hover:text-[#f97316]'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <form onSubmit={handleSubmit}>
              <h4 className="font-bold text-base mb-5 uppercase tracking-wider">
                Stay Updated
              </h4>
              <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                Subscribe to get the latest news and updates from the campaign.
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#f97316] transition-colors"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <button
                  className="bg-[#f97316] text-white text-sm font-bold py-2.5 px-6 rounded-lg hover:bg-[#015b2d] transition-colors"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? '...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Divider + copyright */}
        <div className="border-t border-white/15 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2027 MAI Edo South Campaign. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}