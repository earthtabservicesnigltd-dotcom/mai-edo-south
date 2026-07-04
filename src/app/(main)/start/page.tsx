'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'
import Link from 'next/link'
import { BookOpen, Calendar, BarChart2, Megaphone, UserPlus, ArrowRight, Lock, ChevronDown } from 'lucide-react'

interface Course { id: string; slug: string; short_label: string; title: string; description: string; icon: string; icon_bg: string; icon_color: string }
interface School { slug: string; title: string; description: string; icon: string; icon_bg: string; icon_color: string; courses: Course[] }

const BENEFITS = [
  { icon: '✅', title: 'Certified', desc: 'Earn recognized certificates that boost your CV and credibility.' },
  { icon: '💰', title: '100% Free', desc: 'No tuition fees. All courses are fully sponsored for Edo South residents.' },
  { icon: '🧑‍💻', title: 'Expert Instructors', desc: 'Learn from seasoned leaders, governance experts, and practitioners.' },
  { icon: '💼', title: 'Opportunity-Linked', desc: 'Top graduates get matched with leadership roles, grants, and mentorship.' },
]

const STEPS = [
  { icon: '👤', title: 'Create Account', desc: 'Sign up for free with your details. Takes less than two minutes.' },
  { icon: '📋', title: 'Choose a Course', desc: 'Browse the catalog and enroll in any course that matches your goals.' },
  { icon: '💻', title: 'Learn & Practice', desc: 'Attend lessons, complete projects, and get hands-on with real skills.' },
  { icon: '🏆', title: 'Get Certified', desc: 'Earn certificates and unlock leadership and mentorship opportunities.' },
]

const FAQS = [
  { q: 'Are the courses really free?', a: 'Yes. All MAI Academy courses are 100% free for Edo South residents.' },
  { q: 'Do I need prior experience to enroll?', a: 'Not for most courses. We offer beginner to advanced levels.' },
  { q: 'Will I get a certificate?', a: 'Absolutely. Upon successful completion, you receive a recognized MAI Academy certificate.' },
  { q: 'Are classes online or in-person?', a: 'We offer flexible learning — online and at training centers across Edo South.' },
  { q: 'Can the courses help me find opportunities?', a: 'Yes. Top graduates get matched with leadership roles, grants, and mentorship.' },
]

const SCHOOL_COLORS: Record<string, { bg: string; from: string; to: string }> = {
  'school-of-politics-policy-governance': { bg: '#e6f1fb', from: '#0f172a', to: '#1e3a5f' },
  'school-of-leadership-management': { bg: '#e1f5ee', from: '#0f2810', to: '#015b2d' },
  'school-of-business-entrepreneurship': { bg: '#faeeda', from: '#1c0a00', to: '#6b2c00' },
  'school-of-public-service': { bg: '#fcebeb', from: '#2e0a3d', to: '#6b218a' },
  'school-of-technology-digital-skills': { bg: '#e8f0fe', from: '#0f172a', to: '#1a56db' },
  'school-of-ai-machine-learning': { bg: '#f3e8ff', from: '#2e0a3d', to: '#7c3aed' },
}

// HTML tag colors: Leadership=blue, Business=green, Politics=orange, Public Service=amber, Tech=amber, AI=amber
const TAG_COLORS: Record<string, string> = {
  'school-of-leadership-management': 'bg-blue-50 text-blue-700',
  'school-of-business-entrepreneurship': 'bg-green-50 text-green-700',
  'school-of-politics-policy-governance': 'bg-orange-50 text-orange-700',
  'school-of-public-service': 'bg-amber-50 text-amber-800',
  'school-of-technology-digital-skills': 'bg-amber-50 text-amber-800',
  'school-of-ai-machine-learning': 'bg-amber-50 text-amber-800',
}

const ICON_MAP: Record<string, string> = {
  'ti-users': '👥', 'ti-building-community': '🏛️', 'ti-briefcase': '💼', 'ti-heart-handshake': '🤝',
  'ti-device-laptop': '💻', 'ti-robot': '🤖', 'ti-brain': '🧠', 'ti-devices': '📱', 'ti-landmark': '🏛️',
  'ti-code': '💻', 'ti-shield-lock': '🔒', 'ti-brand-instagram': '📸', 'ti-video': '🎬',
  'ti-world-www': '🌐', 'ti-message-2': '💬', 'ti-database': '🗄️', 'ti-microphone': '🎤',
  'ti-shield-check': '🛡️', 'ti-map-pin': '📍', 'ti-file-spreadsheet': '📄', 'ti-clipboard-data': '📋',
  'ti-building-bank': '🏦', 'ti-crown': '👑', 'ti-rocket': '🚀', 'ti-notes': '📝', 'ti-chess': '♟️',
  'ti-target': '🎯', 'ti-award': '🏅', 'ti-map': '🗺️', 'ti-tools': '🔧', 'ti-package': '📦',
}

export default function AcademyStartPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/academy'
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    async function init() {
      const supabase = supabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) { router.push(next); return }
      try { const res = await fetch('/api/academy/schools'); const d = await res.json(); setSchools(d.schools ?? []) } catch {}
      setLoading(false)
    }
    init()
  }, [])

  const allCourses = schools.flatMap(s => s.courses.map(c => ({ ...c, schoolTitle: s.title, schoolSlug: s.slug })))
  const filteredCourses = activeFilter === 'all' ? allCourses : allCourses.filter(c => c.schoolSlug === activeFilter)
  const displayCourses = activeFilter === 'all' ? (showAll ? filteredCourses : filteredCourses.slice(0, 3)) : filteredCourses

  return (
    <div className="font-['DM_Sans',sans-serif] text-[#111827] bg-white overflow-x-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#01381d] text-white pt-[88px] pb-[72px]">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute -top-[120px] -right-[120px] w-[520px] h-[520px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,.12) 0%, transparent 70%)' }} />
        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="max-w-[720px]">
            <div className="inline-flex items-center gap-2 text-[.68rem] font-semibold tracking-[.16em] uppercase border border-[rgba(249,115,22,.35)] bg-[rgba(249,115,22,.07)] px-4 py-[7px] rounded mb-7 text-[#f97316]">
              <BookOpen size={14} /> MAI Academy · Free Certified Courses
            </div>
            <h1 className="font-['Syne',sans-serif] font-extrabold leading-none tracking-tight text-[clamp(3rem,7vw,5.5rem)] m-0">Take Our <span className="text-[#f97316]">Courses</span></h1>
            <p className="text-white/65 max-w-[500px] leading-[1.8] mt-5 font-light">Learn leadership, governance, and entrepreneurship from expert instructors.</p>
            <div className="flex flex-wrap gap-3 mt-9">
              <a href="#courses" className="inline-flex items-center gap-2 bg-[#f97316] text-white text-[.82rem] font-semibold px-7 py-[14px] rounded-lg no-underline hover:bg-[#ea6a05]">Browse Courses <ArrowRight size={14} /></a>
              <Link href="/academic-auth" className="inline-flex items-center gap-2 bg-white/[.08] text-white/85 text-[.82rem] font-medium px-7 py-[14px] rounded-lg border border-white/[.18] no-underline hover:bg-white/[.14]">Enroll Now <ArrowRight size={14} /></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 mt-[60px] pt-10 border-t border-white/10">
            {[{ num: '100', suffix: '%', label: 'Free Tuition' }, { num: '12', suffix: 'K', label: 'Learners Enrolled' }, { num: '95', suffix: '%', label: 'Completion Rate' }, { num: 'Cert', suffix: '', label: 'Upon Completion' }].map((s, i) => (
              <div key={s.label} className={`py-4 md:py-0 ${i < 3 ? 'md:border-r border-white/10' : ''} ${i === 0 ? 'md:pr-8' : i === 3 ? 'md:pl-8' : 'md:px-8'}`}>
                <div className="font-['Syne',sans-serif] text-[2.6rem] font-extrabold text-white leading-none">{s.num}<span className="text-[#f97316]">{s.suffix}</span></div>
                <div className="text-[.72rem] font-medium tracking-[.08em] uppercase text-white/45 mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-[88px]"><div className="max-w-[1200px] mx-auto px-4">
        <div className="mb-12"><SectionLabel>Why Learn With MAI Academy</SectionLabel><SectionHeading>Education That <span className="text-[#f97316]">Opens Doors</span></SectionHeading><SectionSub>Every course is built for real outcomes — skills, certification, and opportunity.</SectionSub></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENEFITS.map(b => (
            <div key={b.title} className="flex items-start gap-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:-translate-y-1 hover:shadow-[0_2px_16px_rgba(1,56,29,0.07)] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[rgba(1,91,45,.1)] text-[#015b2d] flex items-center justify-center shrink-0 text-xl">{b.icon}</div>
              <div><h6 className="font-['Syne',sans-serif] text-[.95rem] font-bold mb-1">{b.title}</h6><p className="text-[#6B7280] leading-relaxed m-0 font-light">{b.desc}</p></div>
            </div>
          ))}
        </div>
      </div></section>

      {/* COURSE CATALOG */}
      <section id="courses" className="py-[88px] bg-[#F7F4EE]"><div className="max-w-[1200px] mx-auto px-4">
        <div className="mb-12"><SectionLabel>Course Catalog</SectionLabel><SectionHeading>Explore Our <span className="text-[#f97316]">Courses</span></SectionHeading><SectionSub>Pick a course, learn at your pace, and graduate ready to lead.</SectionSub></div>
        
        <div className="flex flex-wrap gap-2 mb-8 items-center justify-center">
          {[{ key: 'all', label: 'All Courses' }, ...schools.map(s => ({ key: s.slug, label: s.title }))].map(f => (
            <button key={f.key} onClick={() => { setActiveFilter(f.key); setShowAll(false) }}
              className={`text-[.75rem] font-semibold tracking-[.06em] whitespace-nowrap uppercase border-[1.5px] rounded-full px-[22px] py-[9px] cursor-pointer transition-all ${activeFilter === f.key ? 'bg-[#f97316] text-white border-[#f97316]' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#f97316] hover:text-[#f97316]'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-[#01381d] border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCourses.map((course, idx) => {
                const colors = SCHOOL_COLORS[course.schoolSlug] || { from: '#333', to: '#555' }
                return (
                  <div key={course.id} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-[5px] hover:shadow-[0_16px_40px_rgba(0,0,0,.09)]">
                    <div className="h-[170px] relative overflow-hidden flex flex-col justify-between p-5" style={{ background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)` }}>
                      <div className="w-12 h-12 rounded-xl bg-white/[.12] backdrop-blur-sm flex items-center justify-center text-xl border border-white/20">{ICON_MAP[course.icon] || '📚'}</div>
                      <div className="font-['Syne',sans-serif] text-[6rem] font-extrabold leading-none absolute -right-2 -bottom-4 text-white/[.06] select-none">{String(idx + 1).padStart(2, '0')}</div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      {/* Tag matching HTML colors: Leadership=blue, Business=green, Politics=orange, others=amber */}
                      <span className={`inline-flex items-center gap-1.5 text-[.66rem] font-bold tracking-[.1em] uppercase px-3.5 py-[5px] rounded ${TAG_COLORS[course.schoolSlug] || 'bg-gray-50 text-gray-700'}`}>
                        {course.schoolTitle}
                      </span>
                      <h5 className="font-['Syne',sans-serif] text-[1.02rem] font-bold mt-2.5 leading-snug">{course.title}</h5>
                      <p className="text-[#6B7280] leading-[1.7] mt-2 flex-1 font-light">{course.description}</p>
                      <div className="mt-auto pt-4"><span className="font-['Syne',sans-serif] font-extrabold text-[1.05rem] text-[#015b2d]">FREE <small className="text-[.68rem] text-[#6B7280] font-normal">/ certified</small></span></div>
                    </div>
                  </div>
                )
              })}
            </div>
            {activeFilter === 'all' && allCourses.length > 3 && (
              <div className="text-center mt-8">
                <button onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 text-[.82rem] font-semibold px-7 py-3 rounded-lg border-2 border-[#E5E7EB] bg-white text-[#111827] hover:border-[#f97316] hover:text-[#f97316] transition-all">
                  {showAll ? 'Show Less ↑' : `View All ${allCourses.length} Courses ↓`}
                </button>
              </div>
            )}
          </>
        )}
      </div></section>

      {/* HOW IT WORKS */}
      <section className="py-[88px]"><div className="max-w-[1200px] mx-auto px-4">
        <div className="mb-12"><SectionLabel>Simple Process</SectionLabel><SectionHeading>How Enrollment <span className="text-[#f97316]">Works</span></SectionHeading><SectionSub>Four easy steps from sign-up to certification.</SectionSub></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map(s => (
            <div key={s.title} className="bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:-translate-y-[5px] hover:shadow-[0_2px_16px_rgba(1,56,29,0.07)] transition-all">
              <div className="w-[54px] h-[54px] rounded-[14px] bg-[rgba(249,115,22,.1)] text-[#f97316] flex items-center justify-center text-[1.5rem] mb-5">{s.icon}</div>
              <h5 className="font-['Syne',sans-serif] text-[1.05rem] font-bold mb-2.5">{s.title}</h5>
              <p className="text-[#6B7280] leading-[1.7] m-0 font-light">{s.desc}</p>
            </div>
          ))}
        </div>
      </div></section>

      {/* ENROLLMENT */}
      <section className="py-[88px] bg-[#F7F4EE]"><div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-[#01381d] rounded-[20px] px-8 md:px-14 py-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
          <div className="absolute -top-[60px] -right-[60px] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,.1) 0%, transparent 70%)' }} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
            <div>
              <div className="text-[.68rem] font-bold tracking-[.16em] uppercase text-[#f97316] mb-2.5">Start Today</div>
              <h2 className="font-['Syne',sans-serif] text-[2.2rem] font-extrabold tracking-tight">Enroll in a <span className="text-[#f97316]">Course Now</span></h2>
              <p className="text-white/60 text-[.92rem] leading-[1.8] font-light mt-3">Reserve your free spot in minutes.</p>
              <div className="mt-6 flex flex-col gap-3">
                {['No fees, no hidden charges', 'Open to all Edo South residents', 'Flexible online & on-site learning', 'Certificate upon completion'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-white/75 text-[.88rem] font-light"><span className="text-[#f97316]">✅</span> {item}</div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-3 p-4 rounded-xl" style={{ border: '1px solid rgba(255,255,255,.1)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 bg-[rgba(249,115,22,.1)] text-[#f97316]">🎓</div>
                <div><div className="text-white text-[.82rem] font-semibold font-['Syne']">Trusted by 12,000+ Learners</div><div className="text-white/45 text-[.75rem] font-light">Across all 18 LGAs in Edo South</div></div>
              </div>
            </div>
            <div className="p-6 md:p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
              <h5 className="font-['Syne'] text-[1.15rem] font-bold text-white mb-1">Create or log in to your account</h5>
              <p className="text-white/45 text-[.82rem] font-light mb-6">Join thousands of learners already enrolled.</p>
              <hr className="border-white/[.08] mb-7" />
              <div className="flex flex-col gap-3">
                <Link href="/academic-auth" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#f97316] text-white font-bold text-[.88rem] hover:bg-[#ea6a05] no-underline"><UserPlus size={16} /> Create Account</Link>
                <p className="text-center text-white/45 text-[.85rem] font-light mb-0">Already have an account? <Link href="/academic-auth" className="text-[#f97316] font-semibold no-underline hover:underline">Log in <ArrowRight size={12} className="inline" /></Link></p>
              </div>
              <p className="mt-4 text-center text-white/30 text-[.72rem] font-light"><Lock size={12} className="inline mr-1 text-white/25" /> Your information is secure.</p>
            </div>
          </div>
        </div>
      </div></section>

      {/* FAQ */}
      <section className="py-[88px]"><div className="max-w-[720px] mx-auto px-4">
        <div className="mb-12 text-center"><SectionLabel>Questions?</SectionLabel><SectionHeading>Frequently Asked <span className="text-[#f97316]">Questions</span></SectionHeading><SectionSub>Everything you need to know before you enroll.</SectionSub></div>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className={`w-full flex items-center justify-between px-6 py-5 cursor-pointer bg-transparent border-none font-['Syne',sans-serif] font-bold text-[.95rem] text-left transition-colors ${openFaq === i ? 'text-[#f97316]' : 'text-[#111827]'}`}>
                {faq.q}<ChevronDown size={16} className={`text-[#f97316] shrink-0 ml-4 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 text-[#6B7280] text-[.88rem] leading-[1.8] font-light px-6 ${openFaq === i ? 'max-h-[260px] pb-5' : 'max-h-0'}`}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div></section>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2 text-[.68rem] font-bold tracking-[.16em] uppercase text-[#f97316] mb-2.5"><span className="inline-block w-5 h-0.5 bg-[#f97316] rounded" />{children}</div>
}
function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-['Syne',sans-serif] font-extrabold tracking-tight leading-[1.1] text-[clamp(1.9rem,4.5vw,2.6rem)] text-[#111827] m-0">{children}</h2>
}
function SectionSub({ children }: { children: React.ReactNode }) {
  return <p className="text-[#6B7280] text-[.92rem] leading-[1.8] max-w-[500px] mt-3 font-light">{children}</p>
}
