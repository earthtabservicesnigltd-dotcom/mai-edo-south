'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface Course {
  id: string
  slug: string
  short_label: string
  title: string
  description: string
  icon: string
  icon_bg: string
  icon_color: string
}

interface School {
  slug: string
  title: string
  description: string
  icon: string
  icon_bg: string
  icon_color: string
  courses: Course[]
}

// ── DATA ──────────────────────────────────────────────────────────────────────

const BENEFITS = [
  { icon: '✅', title: 'Certified', desc: 'Earn recognized certificates that boost your CV and credibility.' },
  { icon: '💰', title: '100% Free', desc: 'No tuition fees. All courses are fully sponsored for Edo South residents.' },
  { icon: '🧑‍💻', title: 'Expert Instructors', desc: 'Learn from seasoned leaders, governance experts, and practitioners.' },
  { icon: '💼', title: 'Opportunity-Linked', desc: 'Top graduates get matched with leadership roles, grants, and mentorship.' },
]

const STEPS = [
  { icon: '👤', title: 'Create Account', desc: 'Sign up for free with your details. Takes less than two minutes to get started.' },
  { icon: '📋', title: 'Choose a Course', desc: 'Browse the catalog and enroll in any course that matches your goals and interests.' },
  { icon: '💻', title: 'Learn & Practice', desc: 'Attend lessons online or on-site, complete projects, and get hands-on with real skills.' },
  { icon: '🏆', title: 'Get Certified', desc: 'Earn your certificate and unlock leadership, grant, and mentorship opportunities through MAI.' },
]

const FAQS = [
  { q: 'Are the courses really free?', a: 'Yes. All MAI Academy courses are 100% free for Edo South residents — fully sponsored as part of our commitment to leadership and workforce development. There are no tuition fees or hidden charges.' },
  { q: 'Do I need prior experience to enroll?', a: 'Not for most courses. We offer beginner, intermediate, and advanced levels. Each course clearly indicates its level so you can choose what fits your current skills.' },
  { q: 'Will I get a certificate?', a: 'Absolutely. Upon successful completion of any course, you receive a recognized MAI Academy certificate that you can add to your CV and share with employers.' },
  { q: 'Are classes online or in-person?', a: 'We offer flexible learning — many courses are available online, while hands-on and practical sessions are held at our training centers across Edo South.' },
  { q: 'Can the courses help me find opportunities?', a: 'Yes. Top-performing graduates are connected to leadership roles, job placements, entrepreneurship grants, and our mentorship network through the MAI Skill & Opportunity Hub.' },
]

const SCHOOL_COLORS: Record<string, { bg: string; from: string; to: string }> = {
  'school-of-politics-policy-governance':  { bg: '#e6f1fb', from: '#0f172a', to: '#1e3a5f' },
  'school-of-leadership-management':       { bg: '#e1f5ee', from: '#0f2810', to: '#015b2d' },
  'school-of-business-entrepreneurship':   { bg: '#faeeda', from: '#1c0a00', to: '#6b2c00' },
  'school-of-public-service':              { bg: '#fcebeb', from: '#2e0a3d', to: '#6b218a' },
  'school-of-technology-digital-skills':   { bg: '#e8f0fe', from: '#0f172a', to: '#1a56db' },
  'school-of-ai-machine-learning':         { bg: '#f3e8ff', from: '#2e0a3d', to: '#7c3aed' },
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function AcademyStartPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/academy'

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const supabase = supabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push(next)
        return
      }

      try {
        const res = await fetch('/api/academy/schools')
        const data = await res.json()
        setSchools(data.schools ?? [])
      } catch {}
      setLoading(false)
    }
    init()
  }, [])

  return (
    <div className="font-['DM_Sans',sans-serif] text-[#111827] bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#01381d] text-white pt-[88px] pb-[72px]">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute -top-[120px] -right-[120px] w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,.12) 0%, transparent 70%)' }} />

        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="max-w-[720px]">
            <div className="inline-flex items-center gap-2 text-[.68rem] font-semibold tracking-[.16em] uppercase text-[#f97316] border border-[rgba(249,115,22,.35)] bg-[rgba(249,115,22,.07)] px-4 py-[7px] rounded mb-7">
              📓 MAI Academy · Free Certified Courses
            </div>
            <h1 className="font-['Syne',sans-serif] font-extrabold leading-none tracking-tight text-[clamp(3rem,7vw,5.5rem)] m-0">
              Take Our <span className="text-[#f97316]">Courses</span>
            </h1>
            <p className="text-[.98rem] text-white/65 max-w-[500px] leading-[1.8] mt-5 font-light">
              Learn leadership, governance, and entrepreneurship from expert instructors. Enroll in free, certified courses designed to make you a capable leader and changemaker — right here in Edo South.
            </p>
            <div className="flex flex-wrap gap-3 mt-9">
              <a href="#courses" className="inline-flex items-center gap-2 bg-[#f97316] text-white text-[.82rem] font-semibold tracking-[.04em] px-7 py-[14px] rounded-lg no-underline hover:bg-[#ea6a05] transition-colors">
                Browse Courses →
              </a>
              <a href="/sign-up" className="inline-flex items-center gap-2 bg-white/[.08] text-white/85 text-[.82rem] font-medium px-7 py-[14px] rounded-lg border border-white/[.18] no-underline hover:bg-white/[.14] transition-colors">
                Enroll Now →
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 mt-[60px] pt-10 border-t border-white/10">
            {[
              { num: '6', suffix: '+', label: 'Schools Available' },
              { num: '30', suffix: '+', label: 'Courses' },
              { num: '100', suffix: '%', label: 'Free Tuition' },
              { num: '95', suffix: '%', label: 'Completion Rate' },
            ].map((s, i) => (
              <div key={s.label} className={`py-4 md:py-0 ${i < 3 ? 'md:border-r border-white/10' : ''} ${i === 0 ? 'md:pr-8' : i === 3 ? 'md:pl-8' : 'md:px-8'}`}>
                <div className="font-['Syne',sans-serif] text-[2.6rem] font-extrabold text-white leading-none">
                  {s.num}<span className="text-[#f97316]">{s.suffix}</span>
                </div>
                <div className="text-[.72rem] font-medium tracking-[.08em] uppercase text-white/45 mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-[88px]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="mb-12">
            <SectionLabel>Why Learn With MAI Academy</SectionLabel>
            <SectionHeading>Education That <span className="text-[#f97316]">Opens Doors</span></SectionHeading>
            <SectionSub>Every course is built for real outcomes — skills, certification, and a direct path to leadership and opportunities.</SectionSub>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map(b => (
              <div key={b.title} className="flex items-start gap-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_2px_16px_rgba(1,56,29,0.07)]">
                <div className="w-12 h-12 rounded-xl bg-[rgba(1,91,45,.1)] text-[#015b2d] flex items-center justify-center shrink-0 text-xl">{b.icon}</div>
                <div>
                  <h6 className="font-['Syne',sans-serif] text-[.95rem] font-bold mb-1">{b.title}</h6>
                  <p className="text-[.83rem] text-[#6B7280] leading-relaxed m-0 font-light">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSE CATALOG ── */}
      <section id="courses" className="py-[88px] bg-[#F7F4EE]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="mb-12">
            <SectionLabel>Course Catalog</SectionLabel>
            <SectionHeading>Explore Our <span className="text-[#f97316]">Schools</span></SectionHeading>
            <SectionSub>Choose a school, then progress through courses in order. Complete all courses in a school to earn your certificate.</SectionSub>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-[#01381d] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {schools.map(school => {
                const colors = SCHOOL_COLORS[school.slug] || { bg: '#f0ede6', from: '#333', to: '#555' }
                return (
                  <div key={school.slug}>
                    {/* School header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: colors.bg }}>
                        <i className={`ti ${school.icon}`} />
                      </div>
                      <div>
                        <h3 className="font-['Syne',sans-serif] text-[1.1rem] font-bold text-[#111827]">{school.title}</h3>
                        <p className="text-[.78rem] text-[#6B7280]">{school.courses.length} courses · complete in order</p>
                      </div>
                    </div>

                    {/* Course cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {school.courses.map((course, idx) => (
                        <div key={course.id}
                          className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,.07)]">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[.6rem] font-bold text-white px-2 py-0.5 rounded"
                              style={{ background: colors.from }}>
                              {course.short_label}
                            </span>
                            <span className="text-[.6rem] text-[#6B7280]">Course {idx + 1} of {school.courses.length}</span>
                          </div>
                          <h4 className="font-['Syne',sans-serif] text-[.9rem] font-bold leading-snug">{course.title}</h4>
                          <p className="text-[.78rem] text-[#6B7280] leading-relaxed mt-1.5 flex-1">{course.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-[88px]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="mb-12">
            <SectionLabel>Simple Process</SectionLabel>
            <SectionHeading>How Enrollment <span className="text-[#f97316]">Works</span></SectionHeading>
            <SectionSub>Four easy steps from sign-up to certification. No paperwork stress, no hidden fees.</SectionSub>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map(s => (
              <div key={s.title} className="bg-white border border-[#E5E7EB] rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_2px_16px_rgba(1,56,29,0.07)]">
                <div className="w-[54px] h-[54px] rounded-[14px] bg-[rgba(249,115,22,.1)] text-[#f97316] flex items-center justify-center text-[1.5rem] mb-5">{s.icon}</div>
                <h5 className="font-['Syne',sans-serif] text-[1.05rem] font-bold mb-2.5">{s.title}</h5>
                <p className="text-[.875rem] text-[#6B7280] leading-[1.7] m-0 font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENROLLMENT ── */}
      <section id="enroll" className="py-[88px] bg-[#F7F4EE]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="bg-[#01381d] rounded-[20px] px-8 md:px-14 py-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }} />
            <div className="absolute -top-[60px] -right-[60px] w-[300px] h-[300px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(249,115,22,.1) 0%, transparent 70%)' }} />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-start relative z-10">
              <div>
                <div className="text-[.68rem] font-bold tracking-[.16em] uppercase text-[#f97316] mb-2.5">Start Today</div>
                <h2 className="font-['Syne',sans-serif] text-[2.2rem] font-extrabold tracking-tight leading-tight">
                  Enroll in a Course Now
                </h2>
                <p className="text-white/60 text-[.92rem] leading-[1.8] font-light mt-3">
                  Create your account, pick a school, and start your first course — all in one go.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {['No fees, no hidden charges', 'Open to all Edo South residents', 'Complete courses at your own pace'].map(item => (
                    <div key={item} className="flex items-center gap-2 text-white/75 text-[.88rem] font-light">
                      <span className="text-[#f97316]">✅</span> {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/[.08] border border-white/[.15] rounded-[14px] p-7 text-center">
                <p className="text-white/60 text-sm mb-4">
                  Create your account and enroll in a course in one step.
                </p>
                <a href="/sign-up"
                  className="block w-full py-3 rounded-lg bg-[#f97316] text-white font-bold text-[.88rem] hover:bg-[#ea6a05] transition-colors no-underline">
                  Create Account & Enroll →
                </a>
                <p className="text-white/40 text-xs mt-3">
                  Already have an account?{' '}
                  <a href="/sign-in" className="text-[#f97316] no-underline hover:underline">Log in</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-[88px]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="mb-12">
            <SectionLabel>Questions?</SectionLabel>
            <SectionHeading>Frequently Asked <span className="text-[#f97316]">Questions</span></SectionHeading>
            <SectionSub>Everything you need to know before you enroll. Still unsure? Reach out to our support team.</SectionSub>
          </div>
          <div className="max-w-[720px] mx-auto">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl mb-3.5 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between px-6 py-5 cursor-pointer bg-transparent border-none font-['Syne',sans-serif] font-bold text-[.95rem] text-left transition-colors
                    ${openFaq === i ? 'text-[#f97316]' : 'text-[#111827]'}`}>
                  {faq.q}
                  <span className={`text-[#f97316] shrink-0 ml-4 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : 'rotate-0'}`}>▾</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 text-[#6B7280] text-[.88rem] leading-[1.8] font-light px-6
                  ${openFaq === i ? 'max-h-[260px] pb-5' : 'max-h-0'}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[.68rem] font-bold tracking-[.16em] uppercase text-[#f97316] mb-2.5">
      <span className="inline-block w-5 h-0.5 bg-[#f97316] rounded" />
      {children}
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-['Syne',sans-serif] font-extrabold tracking-tight leading-[1.1] text-[clamp(1.9rem,4.5vw,2.6rem)] text-[#111827] m-0">
      {children}
    </h2>
  )
}

function SectionSub({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#6B7280] text-[.92rem] leading-[1.8] max-w-[500px] mt-3 font-light">
      {children}
    </p>
  )
}
