'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'
import { toast } from 'sonner'

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface Course {
  id: string
  slug: string
  short_label: string
  description: string
  icon: string
  icon_bg: string
  icon_color: string
}

// ── DATA ──────────────────────────────────────────────────────────────────────

const LGAS = ['Oredo', 'Egor', 'Ikpoba-Okha', 'Ovia North-East', 'Ovia South-West', 'Orhionmwon', 'Uhunmwonde']

const STATIC_COURSES = [
  { id: '01', category: 'leadership', header: 'digital', level: 'Intermediate', icon: '📣', tag: 'Leadership', tagColor: 'blue', title: 'Leadership and Political Communication', desc: 'Master the art of persuasive communication, public speaking, and message strategy to lead, inspire, and mobilize communities effectively.', weeks: 10, lessons: 40, enrolled: '1,200+' },
  { id: '02', category: 'leadership', header: 'digital', level: 'Beginner', icon: '🚩', tag: 'Leadership', tagColor: 'blue', title: 'Foundations of Leadership', desc: 'Build the core principles of effective leadership — vision, integrity, decision-making, and influence — to lead with confidence and purpose.', weeks: 8, lessons: 32, enrolled: '2,400+' },
  { id: '03', category: 'personal', header: 'creative', level: 'Beginner', icon: '✅', tag: 'Personal Development', tagColor: 'orange', title: 'Personal Management Skills', desc: 'Develop time management, self-discipline, goal-setting, and productivity skills to take charge of your personal and professional growth.', weeks: 6, lessons: 24, enrolled: '3,100+' },
  { id: '04', category: 'business', header: 'business', level: 'All Levels', icon: '🚀', tag: 'Business & Enterprise', tagColor: 'green', title: 'Foundations of Business and Entrepreneurship', desc: 'From idea to launch — learn business planning, funding, marketing, and how to build and grow a sustainable enterprise.', weeks: 9, lessons: 36, enrolled: '2,000+' },
  { id: '05', category: 'governance', header: 'vocational', level: 'Intermediate', icon: '🏦', tag: 'Governance', tagColor: 'amber', title: 'Governance, Accountability & Institutions', desc: 'Understand how institutions work, the principles of accountability and transparency, and the structures that drive good governance.', weeks: 11, lessons: 44, enrolled: '980+' },
  { id: '06', category: 'governance', header: 'agriculture', level: 'All Levels', icon: '🏗️', tag: 'Governance', tagColor: 'green', title: 'Local Government and Community Development', desc: 'Explore the role of local government in community development, grassroots mobilization, and delivering services that transform neighborhoods.', weeks: 10, lessons: 38, enrolled: '1,250+' },
  { id: '08', category: 'leadership', header: 'creative', level: 'Advanced', icon: '🧩', tag: 'Leadership', tagColor: 'orange', title: 'Team Dynamics and Real World Challenges', desc: 'Apply teamwork and leadership skills to solve real-world problems through case studies, simulations, and hands-on collaborative projects.', weeks: 9, lessons: 34, enrolled: '1,600+' },
]

const FILTERS = [
  { key: 'all', label: 'All Courses' },
  { key: 'leadership', label: 'Leadership' },
  { key: 'business', label: 'Business & Enterprise' },
  { key: 'governance', label: 'Governance' },
  { key: 'personal', label: 'Personal Development' },
]

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

const headerGradients: Record<string, string> = {
  digital:     'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
  vocational:  'linear-gradient(135deg, #1c0a00 0%, #6b2c00 100%)',
  business:    'linear-gradient(135deg, #0f2810 0%, #015b2d 100%)',
  agriculture: 'linear-gradient(135deg, #1a2e05 0%, #3b6d11 100%)',
  creative:    'linear-gradient(135deg, #2e0a3d 0%, #6b218a 100%)',
}

const tagStyles: Record<string, string> = {
  orange: 'bg-orange-100 text-amber-700',
  blue:   'bg-blue-50 text-blue-700',
  green:  'bg-green-50 text-[#015b2d]',
  amber:  'bg-amber-50 text-amber-800',
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function AcademyCoursesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/academy'

  const [activeFilter, setActiveFilter] = useState('all')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mode, setMode] = useState<'intro' | 'signup' | 'login'>('intro')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })
  const [dbCourses, setDbCourses] = useState<Course[]>([])

  useEffect(() => {
    async function checkExisting() {
      const supabase = supabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.push(next)
    }
    checkExisting()

    async function fetchCourses() {
      try {
        const res = await fetch('/api/academy/courses')
        const data = await res.json()
        if (data.courses?.length) setDbCourses(data.courses)
      } catch {}
    }
    fetchCourses()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { first_name: form.firstName, last_name: form.lastName, phone: form.phone } },
    })
    if (error) { toast.error('Signup failed', { description: error.message }); setLoading(false); return }
    try {
      await fetch('/api/auth/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, firstName: form.firstName }),
      })
    } catch {}
    toast.success('Account created! Please check your email to confirm, then log in.')
    setMode('login')
    setLoading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) { toast.error('Login failed', { description: error.message }); setLoading(false); return }
    router.push(next)
  }

  const filteredCourses = activeFilter === 'all' ? STATIC_COURSES : STATIC_COURSES.filter(c => c.category === activeFilter)

  return (
    <div className="font-['DM_Sans',sans-serif] text-[#111827] bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#01381d] text-white pt-[88px] pb-[72px]">
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Orange glow */}
        <div className="absolute -top-[120px] -right-[120px] w-[520px] h-[520px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,.12) 0%, transparent 70%)' }} />

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
              <a href="#enroll" className="inline-flex items-center gap-2 bg-white/[.08] text-white/85 text-[.82rem] font-medium px-7 py-[14px] rounded-lg border border-white/[.18] no-underline hover:bg-white/[.14] transition-colors">
                Enroll Now →
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 mt-[60px] pt-10 border-t border-white/10">
            {[
              { num: '8', suffix: '+', label: 'Courses Available' },
              { num: '100', suffix: '%', label: 'Free Tuition' },
              { num: '12', suffix: 'K', label: 'Learners Enrolled' },
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
            <SectionHeading>Explore Our <span className="text-[#f97316]">Courses</span></SectionHeading>
            <SectionSub>Pick a course, learn at your pace, and graduate ready to lead. Filter by track to find your fit.</SectionSub>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-2 mb-11">
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)}
                className={`text-[.75rem] font-semibold tracking-[.06em] uppercase border-[1.5px] rounded-full px-[22px] py-[9px] cursor-pointer transition-all duration-300
                  ${activeFilter === f.key ? 'bg-[#f97316] text-white border-[#f97316]' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#f97316] hover:text-[#f97316]'}`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Course grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div key={course.id} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_16px_40px_rgba(0,0,0,.09)]">
                {/* Card header */}
                <div className="h-[170px] relative overflow-hidden flex flex-col justify-between p-5" style={{ background: headerGradients[course.header] }}>
                  <span className="inline-flex items-center gap-1 self-start text-[.62rem] font-bold tracking-[.08em] uppercase px-3 py-1 rounded-full bg-white/[.14] text-white border border-white/20 relative z-10">
                    📊 {course.level}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-white/[.12] backdrop-blur-sm flex items-center justify-center text-[1.3rem] border border-white/20">
                    {course.icon}
                  </div>
                  <div className="font-['Syne',sans-serif] text-[6rem] font-extrabold leading-none absolute -right-2 -bottom-4 text-white/[.06] select-none pointer-events-none">
                    {course.id}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 flex flex-col flex-1">
                  <span className={`inline-flex items-center gap-1.5 text-[.66rem] font-bold tracking-[.1em] uppercase px-3.5 py-[5px] rounded ${tagStyles[course.tagColor]}`}>
                    {course.tag}
                  </span>
                  <h5 className="font-['Syne',sans-serif] text-[1.02rem] font-bold mt-2.5 leading-snug">{course.title}</h5>
                  <p className="text-[.85rem] text-[#6B7280] leading-[1.7] mt-2 flex-1 font-light">{course.desc}</p>
                  <div className="flex flex-wrap gap-3.5 mt-4 pt-4 border-t border-[#E5E7EB]">
                    {[`🕐 ${course.weeks} Weeks`, `🎥 ${course.lessons} Lessons`, `👥 ${course.enrolled}`].map(m => (
                      <span key={m} className="flex items-center gap-1.5 text-[.74rem] text-[#6B7280]">{m}</span>
                    ))}
                  </div>
                  <div className="mt-5">
                    <span className="font-['Syne',sans-serif] font-extrabold text-[1.05rem] text-[#015b2d]">
                      FREE <small className="text-[.68rem] text-[#6B7280] font-normal">/ certified</small>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      {/* ── ENROLLMENT / AUTH ── */}
      <section id="enroll" className="py-[88px] bg-[#F7F4EE]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="bg-[#01381d] rounded-[20px] px-8 md:px-14 py-16 text-white relative overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }} />
            {/* Glow */}
            <div className="absolute -top-[60px] -right-[60px] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,.1) 0%, transparent 70%)' }} />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-start relative z-10">

              {/* Left — copy */}
              <div>
                <div className="text-[.68rem] font-bold tracking-[.16em] uppercase text-[#f97316] mb-2.5">Start Today</div>
                <h2 className="font-['Syne',sans-serif] text-[2.2rem] font-extrabold tracking-tight leading-tight">
                  Enroll in a Course Now
                </h2>
                <p className="text-white/60 text-[.92rem] leading-[1.8] font-light mt-3">
                  Fill out the form to reserve your free spot. Our team will reach out within 48 hours to confirm your enrollment and next steps.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {['No fees, no hidden charges', 'Open to all Edo South residents', 'Flexible online & on-site learning'].map(item => (
                    <div key={item} className="flex items-center gap-2 text-white/75 text-[.88rem] font-light">
                      <span className="text-[#f97316]">✅</span> {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — auth card */}
              <div className="bg-white/[.08] border border-white/[.15] rounded-[14px] p-7">
                <p className="text-[.78rem] text-white/50 mb-4 uppercase tracking-[.08em] font-semibold">
                  Create or log in to your account
                </p>

                {mode === 'intro' && (
                  <div className="flex flex-col gap-2.5">
                    <button onClick={() => setMode('signup')}
                      className="w-full py-3 rounded-lg border-none cursor-pointer bg-[#f97316] text-white font-bold text-[.88rem] hover:bg-[#ea6a05] transition-colors">
                      Create Account
                    </button>
                    <button onClick={() => setMode('login')}
                      className="w-full py-3 rounded-lg cursor-pointer bg-transparent text-white/80 font-semibold text-[.88rem] border border-white/20 hover:bg-white/[.08] transition-colors">
                      Already have an account? Log in
                    </button>
                  </div>
                )}

                {mode === 'signup' && (
                  <form onSubmit={handleSignup} className="flex flex-col gap-2.5">
                    <div className="grid grid-cols-2 gap-2.5">
                      <AuthInput name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
                      <AuthInput name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
                    </div>
                    <AuthInput name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
                    <AuthInput name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} required />
                    <AuthInput name="password" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={handleChange} required />
                    <button type="submit" disabled={loading}
                      className="w-full py-3 rounded-lg border-none cursor-pointer bg-[#f97316] text-white font-bold text-[.88rem] hover:bg-[#ea6a05] transition-colors disabled:opacity-60">
                      {loading ? 'Creating account...' : 'Sign Up →'}
                    </button>
                    <button type="button" onClick={() => setMode('login')}
                      className="bg-transparent border-none text-white/55 text-[.8rem] cursor-pointer text-center hover:text-white/80 transition-colors">
                      Already have an account? Log in
                    </button>
                  </form>
                )}

                {mode === 'login' && (
                  <form onSubmit={handleLogin} className="flex flex-col gap-2.5">
                    <AuthInput name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
                    <AuthInput name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                    <button type="submit" disabled={loading}
                      className="w-full py-3 rounded-lg border-none cursor-pointer bg-[#f97316] text-white font-bold text-[.88rem] hover:bg-[#ea6a05] transition-colors disabled:opacity-60">
                      {loading ? 'Logging in...' : 'Log In →'}
                    </button>
                    <button type="button" onClick={() => setMode('signup')}
                      className="bg-transparent border-none text-white/55 text-[.8rem] cursor-pointer text-center hover:text-white/80 transition-colors">
                      Don&apos;t have an account? Sign up
                    </button>
                  </form>
                )}
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

function AuthInput({ name, type = 'text', placeholder, value, onChange, required }: {
  name: string; type?: string; placeholder: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean
}) {
  return (
    <input
      name={name} type={type} placeholder={placeholder}
      value={value} onChange={onChange} required={required}
      className="w-full px-3.5 py-[11px] border border-white/[.15] bg-white/[.06] rounded-lg text-[.86rem] text-white outline-none placeholder:text-white/30 focus:border-[#f97316] transition-colors box-border"
    />
  )
}

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