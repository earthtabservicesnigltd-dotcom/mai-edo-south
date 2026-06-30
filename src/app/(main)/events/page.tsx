'use client'
import { useState } from 'react'

const EVENTS = [
  {
    id: 1,
    title: 'Town Hall Meeting - Oredo LGA',
    date: 'June 22, 2026',
    time: '2:00 PM',
    location: 'Oredo Local Government Secretariat, Benin City',
    category: 'townhall',
    description: 'Direct engagement with constituents to discuss local issues, education reform, and healthcare improvement.',
    image: null,
  },
  {
    id: 2,
    title: 'Women in Leadership & Development Summit',
    date: 'July 20, 2026',
    time: '1:00 PM',
    location: 'Benin Civic Centre',
    category: 'summit',
    description: 'Celebrating and empowering women through policy dialogue, entrepreneurship training, and advocacy.',
    image: null,
  },
  {
    id: 3,
    title: 'Major Stakeholder Endorsement & Strategy Meeting',
    date: 'August 2, 2026',
    time: '4:00 PM',
    location: 'Private Venue, Benin City',
    category: 'rally',
    description: 'High-level meeting with traditional rulers, business leaders, and community stakeholders.',
    image: null,
  },
  {
    id: 4,
    title: 'Youth Empowerment Forum - Ikpoba Okha',
    date: 'August 15, 2026',
    time: '10:00 AM',
    location: 'Ikpoba Okha LGA Hall',
    category: 'community',
    description: 'A forum dedicated to youth engagement, skills acquisition, and entrepreneurship opportunities.',
    image: null,
  },
  {
    id: 5,
    title: 'Community Outreach - Ovia North East',
    date: 'September 5, 2026',
    time: '9:00 AM',
    location: 'Ovia North East LGA',
    category: 'community',
    description: 'Grassroots engagement with communities across Ovia North East LGA.',
    image: null,
  },
  {
    id: 6,
    title: 'Grand Campaign Rally - Benin City',
    date: 'October 10, 2026',
    time: '12:00 PM',
    location: 'Samuel Ogbemudia Stadium, Benin City',
    category: 'rally',
    description: 'The biggest rally of the campaign season. Come out and show your support for MAI.',
    image: null,
  },
]

const FILTERS = [
  { label: 'All Events',        value: 'all' },
  { label: 'Rallies',           value: 'rally' },
  { label: 'Town Halls',        value: 'townhall' },
  { label: 'Community Outreach',value: 'community' },
  { label: 'Summits',           value: 'summit' },
]

const CATEGORY_COLORS: Record<string, string> = {
  rally:     'bg-red-100 text-red-700',
  townhall:  'bg-blue-100 text-blue-700',
  community: 'bg-green-100 text-green-700',
  summit:    'bg-purple-100 text-purple-700',
}

function shareEvent(platform: string, title: string) {
  const url = window.location.href
  const links: Record<string, string> = {
    twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + '\n' + url)}`,
  }
  window.open(links[platform], '_blank')
}

export default function EventsPage() {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('all')

  const filtered = EVENTS.filter(e => {
    const matchesCategory = category === 'all' || e.category === category
    const matchesSearch   = e.title.toLowerCase().includes(search.toLowerCase()) ||
                            e.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">
            Community & Campaign Activities
          </p>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">
            UPCOMING <span className="text-[#f97316]">EVENTS</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-xl">
            Join us at our upcoming programs, town halls, rallies, and community
            engagements across Edo South.
          </p>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events..."
              className="border-2 border-gray-200 rounded-full px-5 py-2.5 text-sm w-full md:max-w-xs focus:outline-none focus:border-[#f97316] transition-colors"
            />
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setCategory(f.value)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
                    category === f.value
                      ? 'bg-[#f97316] border-[#f97316] text-white'
                      : 'border-gray-200 text-gray-600 hover:border-[#f97316] hover:text-[#f97316]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No events found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(event => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-2 transition-transform duration-300"
                >
                  {/* Image placeholder */}
                  <div className="h-52 bg-gradient-to-br from-[#01381d] to-[#015b2d] flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                    </svg>
                  </div>

                  <div className="p-6">
                    {/* Date badge */}
                    <span className="inline-block bg-[#f97316] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                      {event.date} • {event.time}
                    </span>

                    {/* Category badge */}
                    <span className={`inline-block ml-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 ${CATEGORY_COLORS[event.category]}`}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>

                    <h5 className="font-bold text-[17px] mb-2 leading-snug">{event.title}</h5>
                    <p className="text-gray-500 text-sm leading-relaxed mb-3">{event.description}</p>

                    <div className="flex items-start gap-2 text-sm text-gray-500 mb-4">
                      <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#f97316]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {event.location}
                    </div>

                    {/* Share buttons */}
                    <div className="flex items-center gap-2 mb-4">
                      {[
                        { platform: 'twitter',  label: '𝕏' },
                        { platform: 'facebook', label: '📘' },
                        { platform: 'whatsapp', label: '💬' },
                      ].map(s => (
                        <button
                          key={s.platform}
                          onClick={() => shareEvent(s.platform, event.title)}
                          className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#f97316] hover:text-white transition-colors flex items-center justify-center text-sm"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    <a
                      href="#"
                      className="block w-full text-center border-2 border-[#015b2d] text-[#015b2d] font-bold py-2.5 rounded-xl hover:bg-[#015b2d] hover:text-white transition-colors text-sm"
                    >
                      Register / Learn More
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-[#01381d] to-[#015b2d] rounded-3xl p-10 md:p-16 text-center text-white">
            <h2 className="font-heading text-5xl mb-3">STAY UPDATED</h2>
            <p className="text-gray-200 mb-8">Subscribe for the latest news and announcements.</p>
            <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 bg-white/10 border border-white/20 text-white placeholder:text-gray-400 px-5 py-3 rounded-xl focus:outline-none focus:border-[#f97316] text-sm"
              />
              <button className="bg-[#f97316] text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-[#f97316] transition-colors text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}