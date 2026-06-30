'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const PROGRAMS = [
  { id: 1, category: 'Political', tag: 'Political Science', tagColor: 'bg-blue-100 text-blue-700', icon: '🌐', num: '01', title: 'School of Politics, Policy and Governance', desc: 'Explore politics as the process of power and decision-making, understand policy as the blueprint for solving societal problems, and learn governance as the implementation that turns decisions into action.' },
  { id: 2, category: 'Business', tag: 'Business Administration', tagColor: 'bg-blue-100 text-blue-700', icon: '📈', num: '02', title: 'School of Leadership and Management', desc: 'Master leadership skills, strategic management, team building, and organizational development. Built for entrepreneurs and aspiring professionals.' },
  { id: 3, category: 'Public', tag: 'Public Administration', tagColor: 'bg-amber-100 text-amber-700', icon: '🏛️', num: '03', title: 'School of Public Service', desc: 'Develop expertise in public sector leadership, policy development, strategic government administration, and nonprofit organizational management. Gain practical skills for careers in public service with professional certification.' },
  { id: 4, category: 'Business', tag: 'Business Administration', tagColor: 'bg-green-100 text-green-700', icon: '💼', num: '04', title: 'School of Business and Entrepreneurship', desc: 'From business planning to securing funding learn how to launch and scale a sustainable small business.' },
  { id: 5, category: 'Digital', tag: 'Digital Skills', tagColor: 'bg-green-100 text-green-700', icon: '💻', num: '05', title: 'School of Technology and Digital Skills', desc: 'Coding, web development, AI, cybersecurity, and digital marketing designed for tech careers and digital innovation.' },
  { id: 6, category: 'Digital', tag: 'Digital Skills', tagColor: 'bg-blue-100 text-blue-700', icon: '🤖', num: '06', title: 'School of Artificial Intelligence and Machine Learning', desc: 'Deep learning, neural networks, AI model development and machine learning algorithms designed for building intelligent systems and AI-powered applications.' },
]

const FILTERS = ['All Programs', 'Political', 'Business', 'Public', 'Digital']

const OPPORTUNITIES = [
  { icon: '👥', title: 'Campaign Team Positions — MAI Edo South 2027', desc: 'Multiple volunteer and paid positions available: Field Coordinators, Social Media Managers, Event Staff, and Community Outreach Representatives.', cta: 'Apply Now', ctaStyle: 'primary' },
  { icon: '💼', title: 'Local Business Partnership Program', desc: 'MAI is connecting trained graduates with local businesses seeking skilled workers. Opportunities in retail, construction, tech, agriculture, and services across Edo South.', cta: 'View Opportunities', ctaStyle: 'outline' },
  { icon: '🏢', title: 'Government Contract Workforce Initiative', desc: "MAI's commitment to job creation through government contracts. Priority hiring for program graduates in infrastructure, healthcare, education, and public services.", cta: 'Learn More', ctaStyle: 'outline' },
  { icon: '💱', title: 'Entrepreneurship Grant Opportunities', desc: 'Startup grants up to ₦500,000 for young entrepreneurs with viable business plans. Applications open quarterly with mentorship and business development support included.', cta: 'Apply for Grant', ctaStyle: 'primary' },
]

const STORIES = [
  { initials: 'AO', bg: 'bg-[#f97316]', bannerBg: 'bg-blue-600', type: 'Scholarship Achievement', typeColor: 'text-blue-700', title: '"How I Won a Scholarship to Canada"', author: 'Amara Okonkwo', location: 'Benin City', badge: 'Full Scholarship — University of Toronto', badgeBg: 'bg-blue-100 text-blue-700', desc: "Through MAI Academy's scholarship mentorship program, Amara navigated the application process, secured funding support, and is now pursuing a Masters in Computer Science abroad — returning to give back to Edo South." },
  { initials: 'EC', bg: 'bg-[#015b2d]', bannerBg: 'bg-[#015b2d]', type: 'Remote Job Placement', typeColor: 'text-[#015b2d]', title: '"From Benin City to a Remote Tech Job"', author: 'Emeka Chukwu', location: 'Oredo LGA', badge: 'Remote Frontend Developer — London', badgeBg: 'bg-green-100 text-green-700', desc: 'After completing the Digital Skills track, Emeka built his portfolio and landed a remote role with a UK-based startup — earning in foreign currency while living in Benin City and mentoring others in the Hub.' },
  { initials: 'FI', bg: 'bg-orange-800', bannerBg: 'bg-orange-700', type: 'Business Growth', typeColor: 'text-amber-700', title: '"How the Hub Helped Me Launch My Business"', author: 'Fatima Ibrahim', location: 'Egor LGA', badge: '₦500K Grant Recipient', badgeBg: 'bg-orange-100 text-orange-700', desc: 'Armed with the Entrepreneurship program certificate and a ₦500,000 startup grant, Fatima launched a sustainable fashion label now employing five Edo South youth — with plans to expand across the South-South region.' },
]

const SIDEBAR_NAV = [
  { icon: '🎓', label: 'Scholarships & Grants', href: '#' },
  { icon: '💼', label: 'Jobs & Internships', href: '#opportunities' },
  { icon: '🚀', label: 'Entrepreneurship Hub', href: '#' },
  { icon: '👥', label: 'Mentorship Network', href: '#' },
  { icon: '🪪', label: 'Talent Bank', href: '#' },
  { icon: '🏆', label: 'Success Stories', href: '#success-stories' },
]

const CATS = ['MAI Academy', 'Scholarships', 'Grants', 'Fellowships', 'Internships', 'Remote Jobs', 'Local Jobs', 'Competitions', 'Exchange Programs', 'Volunteer Programs', 'Conference', 'Mentorship Program', 'Success Stories']

export default function SkillHubPage() {
  const [activeFilter, setActiveFilter] = useState('All Programs')
  const [activeCat, setActiveCat] = useState('MAI Academy')
  const [activeSideNav, setActiveSideNav] = useState('Scholarships & Grants')

  const filtered = activeFilter === 'All Programs'
    ? PROGRAMS
    : PROGRAMS.filter(p => p.category === activeFilter)

  return (
    <>
      {/* HERO */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #01381d 0%, #015b2d 50%, #01381d 100%)' }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
              ⚡ Workforce Development & Economic Opportunities
            </div>
            <h1 className="font-heading text-6xl md:text-8xl text-white leading-none mb-6">
              Global Skill <span className="text-[#f97316]">&</span><br />Opportunity Hub
            </h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-xl mb-8">
              Empowering Edo South with training programs, job opportunities, entrepreneurship support, and career development resources — free for all residents.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#programs" className="bg-[#f97316] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-white hover:text-[#f97316] transition-colors">
                Browse Programs →
              </a>
              <a href="#opportunities" className="border-2 border-white text-white font-bold px-6 py-3.5 rounded-xl hover:bg-white hover:text-[#01381d] transition-colors">
                View Opportunities →
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { num: '500+', label: 'Training Slots Open' },
              { num: '9', label: 'Skill Programs' },
              { num: '₦500K', label: 'Max Startup Grant' },
              { num: '6mo', label: 'Avg Program Duration' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 border border-white/20 rounded-2xl px-5 py-4">
                <div className="font-heading text-3xl text-white">{s.num}</div>
                <div className="text-white/70 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-[-3px] left-0 right-0">
          <svg className="block w-full" viewBox="0 0 1440 80" fill="none">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 45C1200 40 1320 30 1380 25L1440 20V80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* FEATURED OPPORTUNITY */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[#015b2d] font-bold text-xs uppercase tracking-widest mb-2">Featured Opportunity</p>
          <h2 className="font-heading text-4xl md:text-5xl mb-10">Currently <span className="text-[#f97316]">Enrolling</span></h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="lg:col-span-5 bg-[#01381d] min-h-64 relative">
              <Image src="/image-31.png" alt="MAI Youth Digital Skills Academy" fill className="object-cover opacity-70" />
            </div>
            <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-center">
              <span className="inline-block bg-[#f97316]/10 text-[#f97316] text-xs font-bold px-3 py-1 rounded-full mb-4">Training Program</span>
              <h3 className="font-heading text-3xl md:text-4xl text-[#01381d] mb-4">MAI Youth Digital Skills Academy Free Enrollment Open</h3>
              <p className="text-gray-500 leading-relaxed mb-6">Access opportunities, learn new skills, discover scholarships, find jobs, connect with mentors and unlock your potential.</p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Link href="#" className="bg-[#f97316] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#015b2d] transition-colors text-sm">Apply Now →</Link>
                <Link href="#" className="border-2 border-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl hover:border-[#01381d] hover:text-[#01381d] transition-colors text-sm">Program Details →</Link>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">📅 Starts Sept 2027</span>
                <span className="flex items-center gap-1.5">⏱ 6 Months</span>
                <span className="flex items-center gap-1.5">👥 500 Slots</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS WITH SIDEBAR */}
      <section className="py-20 bg-gray-50" id="programs">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Sidebar */}
            <aside className="w-full lg:w-72 shrink-0 space-y-5">
              {/* Main Menu */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                  <span className="text-[#f97316]">▦</span>
                  <h6 className="font-bold text-sm text-[#01381d] m-0">Main Menu</h6>
                </div>
                <nav className="p-2">
                  {SIDEBAR_NAV.map(item => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setActiveSideNav(item.label)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 ${
                        activeSideNav === item.label
                          ? 'bg-[#01381d] text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Categories */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                  <span className="text-[#f97316]">🏷</span>
                  <h6 className="font-bold text-sm text-[#01381d] m-0">Categories</h6>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {CATS.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCat(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        activeCat === cat
                          ? 'bg-[#01381d] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Success Stories Preview */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                  <span className="text-[#f97316]">⭐</span>
                  <h6 className="font-bold text-sm text-[#01381d] m-0">Success Stories</h6>
                </div>
                <div className="p-3 space-y-1">
                  {[
                    { init: 'AO', bg: 'bg-[#f97316]', title: 'How I Won a Scholarship to Canada', meta: 'Scholarship · Amara O.' },
                    { init: 'EC', bg: 'bg-[#015b2d]', title: 'From Benin City to a Remote Tech Job', meta: 'Remote Job · Emeka C.' },
                    { init: 'FI', bg: 'bg-orange-800', title: 'How the Hub Helped Me Launch My Business', meta: 'Business Growth · Fatima I.' },
                  ].map(s => (
                    <a key={s.init} href="#success-stories" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className={`w-9 h-9 ${s.bg} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>{s.init}</div>
                      <div>
                        <div className="text-xs font-semibold text-gray-800 leading-snug">{s.title}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{s.meta}</div>
                      </div>
                    </a>
                  ))}
                  <div className="px-3 pt-1 pb-2">
                    <a href="#success-stories" className="block text-center border-2 border-gray-200 text-gray-600 text-xs font-bold py-2 rounded-xl hover:border-[#01381d] hover:text-[#01381d] transition-colors">
                      View All Stories →
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <p className="text-[#015b2d] font-bold text-xs uppercase tracking-widest mb-2">What We Offer</p>
              <h2 className="font-heading text-4xl md:text-5xl mb-2">Skill Development <span className="text-[#f97316]">Programs</span></h2>
              <p className="text-gray-500 mb-6">Choose a track that fits your ambitions. All programs are free, certified, and designed for real employment outcomes.</p>

              {/* Filter bar */}
              <div className="flex flex-wrap gap-2 mb-8">
                {FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
                      activeFilter === f ? 'bg-[#01381d] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#01381d]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map(p => (
                  <div key={p.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 transition-transform duration-200">
                    <div className="bg-gradient-to-r from-[#01381d] to-[#015b2d] px-5 py-4 flex items-center justify-between">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">{p.icon}</div>
                      <span className="font-heading text-3xl text-white/30">{p.num}</span>
                    </div>
                    <div className="p-5">
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${p.tagColor}`}>{p.tag}</span>
                      <h5 className="font-bold text-base text-[#01381d] mb-2 leading-snug">{p.title}</h5>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.desc}</p>
                      <Link href="#" className="text-[#f97316] text-sm font-bold hover:gap-2 transition-all">Learn More →</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* JOB OPPORTUNITIES */}
      <section className="py-20 bg-white" id="opportunities">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[#015b2d] font-bold text-xs uppercase tracking-widest mb-2">Now Hiring</p>
          <h2 className="font-heading text-4xl md:text-5xl mb-3">Current Job <span className="text-[#f97316]">Opportunities</span></h2>
          <p className="text-gray-500 mb-10">Open roles, partnerships, and grant opportunities available to Edo South residents right now.</p>

          <div className="space-y-4">
            {OPPORTUNITIES.map((opp, i) => (
              <div key={i} className="flex items-start gap-5 bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-[#01381d]/20 transition-colors">
                <div className="w-12 h-12 bg-[#01381d] rounded-xl flex items-center justify-center text-xl shrink-0">{opp.icon}</div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-base text-[#01381d] mb-1">{opp.title}</h5>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{opp.desc}</p>
                  <Link
                    href="#"
                    className={`inline-block text-sm font-bold px-5 py-2 rounded-xl transition-colors ${
                      opp.ctaStyle === 'primary'
                        ? 'bg-[#f97316] text-white hover:bg-[#015b2d]'
                        : 'border-2 border-gray-300 text-gray-700 hover:border-[#01381d] hover:text-[#01381d]'
                    }`}
                  >
                    {opp.cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="py-20 bg-gray-50" id="success-stories">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[#015b2d] font-bold text-xs uppercase tracking-widest mb-2">Inspiring Journeys</p>
          <h2 className="font-heading text-4xl md:text-5xl mb-3">Success <span className="text-[#f97316]">Stories</span></h2>
          <p className="text-gray-500 mb-8">Real members. Real achievements. See how the Hub is transforming lives across Edo South.</p>

          {/* Achievement highlights */}
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              { icon: '🎓', label: 'Scholarships Won', sub: 'Members studying globally', bg: 'bg-blue-50' },
              { icon: '💻', label: 'Jobs & Promotions', sub: 'Local & remote placements', bg: 'bg-green-50' },
              { icon: '🏪', label: 'Business Growth', sub: 'Startups launched & scaled', bg: 'bg-orange-50' },
            ].map(a => (
              <div key={a.label} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-5 py-3.5 shadow-sm">
                <div className={`w-10 h-10 ${a.bg} rounded-xl flex items-center justify-center text-xl`}>{a.icon}</div>
                <div>
                  <div className="font-bold text-sm">{a.label}</div>
                  <div className="text-xs text-gray-400">{a.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STORIES.map((s, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className={`${s.bannerBg} h-24 relative flex items-end justify-between px-5 pb-4`}>
                  <div className={`w-14 h-14 ${s.bg} rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white`}>{s.initials}</div>
                </div>
                <div className="p-5">
                  <div className={`text-xs font-bold mb-1 ${s.typeColor}`}>{s.type}</div>
                  <h5 className="font-bold text-base text-[#01381d] mb-1 leading-snug">{s.title}</h5>
                  <div className="text-xs text-gray-400 mb-3">👤 {s.author} · {s.location}</div>
                  <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-3 ${s.badgeBg}`}>{s.badge}</span>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Submit story CTA */}
          <div className="mt-10 bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
            <div className="w-14 h-14 bg-[#f97316]/10 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">✏️</div>
            <h5 className="font-bold text-lg mb-2">Have a Success Story?</h5>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">If the Hub helped you land a scholarship, job, promotion, or grow your business — share your journey and inspire others.</p>
            <Link href="#" className="inline-block bg-[#f97316] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#015b2d] transition-colors text-sm">
              Submit Your Story →
            </Link>
          </div>
        </div>
      </section>

      {/* VOLUNTEER & LEADERSHIP */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[#015b2d] font-bold text-xs uppercase tracking-widest mb-2">Get Involved</p>
          <h2 className="font-heading text-4xl md:text-5xl mb-3">Volunteer <span className="text-[#f97316]">& Leadership</span></h2>
          <p className="text-gray-500 mb-10">Step up, contribute, and help shape the future of Edo South&apos;s workforce alongside MAI&apos;s growing team.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📢', tag: 'Volunteer', tagColor: 'bg-[#f97316]/10 text-[#f97316]', title: 'Media & Publicity', desc: 'Master social media marketing, content creation, public relations, and brand storytelling. Build your influence and promote campaigns that drive real engagement.', cta: 'Become a Mentor' },
              { icon: '👥', tag: 'Leadership', tagColor: 'bg-[#015b2d]/10 text-[#015b2d]', title: 'Community Engagement', desc: 'Build strong community connections, organize local initiatives and foster partnerships that empower neighborhoods and create lasting social impact.', cta: 'Apply Now' },
              { icon: '🚚', tag: 'Volunteer', tagColor: 'bg-[#f97316]/10 text-[#f97316]', title: 'Logistics', desc: 'Coordinate event logistics, manage equipment and supplies, organize transportation, and ensure smooth operational execution for all programs.', cta: 'Apply Now' },
            ].map((v, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-200">
                <div className="w-12 h-12 bg-[#015b2d] rounded-xl flex items-center justify-center text-white text-xl mb-4">{v.icon}</div>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${v.tagColor}`}>{v.tag}</span>
                <h5 className="font-bold text-base mb-2">{v.title}</h5>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{v.desc}</p>
                <Link href="/volunteer" className="text-[#f97316] text-sm font-bold">{v.cta} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}