'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ── DATA ──────────────────────────────────────────────────────────────────────

const LGAS = ['Oredo', 'Egor', 'Ikpoba-Okha', 'Ovia North-East', 'Ovia South-West', 'Orhionmwon', 'Uhunmwonde']

const COURSES = [
  {
    id: '01', category: 'leadership', header: 'digital',
    level: 'Intermediate', icon: '📣',
    tag: 'Leadership', tagColor: 'blue',
    title: 'Leadership and Political Communication',
    desc: 'Master the art of persuasive communication, public speaking, and message strategy to lead, inspire, and mobilize communities effectively.',
    weeks: 10, lessons: 40, enrolled: '1,200+',
  },
  {
    id: '02', category: 'leadership', header: 'digital',
    level: 'Beginner', icon: '🚩',
    tag: 'Leadership', tagColor: 'blue',
    title: 'Foundations of Leadership',
    desc: 'Build the core principles of effective leadership — vision, integrity, decision-making, and influence — to lead with confidence and purpose.',
    weeks: 8, lessons: 32, enrolled: '2,400+',
  },
  {
    id: '03', category: 'personal', header: 'creative',
    level: 'Beginner', icon: '✅',
    tag: 'Personal Development', tagColor: 'orange',
    title: 'Personal Management Skills',
    desc: 'Develop time management, self-discipline, goal-setting, and productivity skills to take charge of your personal and professional growth.',
    weeks: 6, lessons: 24, enrolled: '3,100+',
  },
  {
    id: '04', category: 'business', header: 'business',
    level: 'All Levels', icon: '🚀',
    tag: 'Business & Enterprise', tagColor: 'green',
    title: 'Foundations of Business and Entrepreneurship',
    desc: 'From idea to launch — learn business planning, funding, marketing, and how to build and grow a sustainable enterprise.',
    weeks: 9, lessons: 36, enrolled: '2,000+',
  },
  {
    id: '05', category: 'governance', header: 'vocational',
    level: 'Intermediate', icon: '🏦',
    tag: 'Governance', tagColor: 'amber',
    title: 'Governance, Accountability & Institutions',
    desc: 'Understand how institutions work, the principles of accountability and transparency, and the structures that drive good governance.',
    weeks: 11, lessons: 44, enrolled: '980+',
  },
  {
    id: '06', category: 'governance', header: 'agriculture',
    level: 'All Levels', icon: '🏗️',
    tag: 'Governance', tagColor: 'green',
    title: 'Local Government and Community Development',
    desc: 'Explore the role of local government in community development, grassroots mobilization, and delivering services that transform neighborhoods.',
    weeks: 10, lessons: 38, enrolled: '1,250+',
  },
  {
    id: '08', category: 'leadership', header: 'creative',
    level: 'Advanced', icon: '🧩',
    tag: 'Leadership', tagColor: 'orange',
    title: 'Team Dynamics and Real World Challenges',
    desc: 'Apply teamwork and leadership skills to solve real-world problems through case studies, simulations, and hands-on collaborative projects.',
    weeks: 9, lessons: 34, enrolled: '1,600+',
  },
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


// ── HEADER GRADIENT MAP ───────────────────────────────────────────────────────

const headerGradients: Record<string, string> = {
  digital:     'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
  vocational:  'linear-gradient(135deg, #1c0a00 0%, #6b2c00 100%)',
  business:    'linear-gradient(135deg, #0f2810 0%, #015b2d 100%)',
  agriculture: 'linear-gradient(135deg, #1a2e05 0%, #3b6d11 100%)',
  creative:    'linear-gradient(135deg, #2e0a3d 0%, #6b218a 100%)',
}

// ── TAG STYLES ────────────────────────────────────────────────────────────────

const tagStyles: Record<string, string> = {
  orange: 'bg-orange-100 text-amber-700',
  blue:   'bg-blue-50 text-blue-700',
  green:  'bg-green-50 text-[#015b2d]',
  amber:  'bg-amber-50 text-amber-800',
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function TakeOurCoursesPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [enrollSubmitted, setEnrollSubmitted] = useState(false)
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)

  // Enroll form state
  const [enrollName, setEnrollName] = useState('')
  const [enrollPhone, setEnrollPhone] = useState('')
  const [enrollEmail, setEnrollEmail] = useState('')
  const [enrollLga, setEnrollLga] = useState('')
  const [enrollCourse, setEnrollCourse] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const filteredCourses = activeFilter === 'all'
    ? COURSES
    : COURSES.filter(c => c.category === activeFilter)

  function handleEnrollSubmit() {
    setEnrollSubmitted(true)
  }

  function handleNewsletterSubmit() {
    setNewsletterSubmitted(true)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#111827', background: '#fff', overflowX: 'hidden' }}>

    

      {/* ── HERO ── */}
      <section style={{
        background: '#01381d', color: '#fff',
        padding: '88px 0 72px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Orange glow */}
        <div style={{
          position: 'absolute', top: -120, right: -120,
          width: 520, height: 520, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(249,115,22,.12) 0%, transparent 70%)',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: '.68rem', fontWeight: 600, letterSpacing: '.16em',
              textTransform: 'uppercase', color: '#f97316',
              border: '1px solid rgba(249,115,22,.35)', background: 'rgba(249,115,22,.07)',
              padding: '7px 16px', borderRadius: 4, marginBottom: 28,
            }}>
              📓 MAI Academy · Free Certified Courses
            </div>

            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: 800, lineHeight: 1, letterSpacing: '-.02em', margin: 0,
            }}>
              Take Our <span style={{ color: '#f97316' }}>Courses</span>
            </h1>

            <p style={{ fontSize: '.98rem', color: 'rgba(255,255,255,.65)', maxWidth: 500, lineHeight: 1.8, marginTop: 20, fontWeight: 300 }}>
              Learn leadership, governance, and entrepreneurship from expert instructors. Enroll in free, certified courses designed to make you a capable leader and changemaker — right here in Edo South.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36 }}>
              <a href="#courses" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#f97316', color: '#fff',
                fontSize: '.82rem', fontWeight: 600, letterSpacing: '.04em',
                padding: '14px 28px', borderRadius: 8, textDecoration: 'none',
              }}>
                Browse Courses →
              </a>
              <a href="#enroll" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.85)',
                fontSize: '.82rem', fontWeight: 500,
                padding: '14px 28px', borderRadius: 8,
                border: '1px solid rgba(255,255,255,.18)', textDecoration: 'none',
              }}>
                Enroll Now →
              </a>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            marginTop: 60, paddingTop: 40,
            borderTop: '1px solid rgba(255,255,255,.1)',
          }}>
            {[
              { num: '8', suffix: '+', label: 'Courses Available' },
              { num: '100', suffix: '%', label: 'Free Tuition' },
              { num: '12', suffix: 'K', label: 'Learners Enrolled' },
              { num: '95', suffix: '%', label: 'Completion Rate' },
            ].map((s, i) => (
              <div key={s.label} style={{
                padding: i === 0 ? '0 32px 0 0' : i === 3 ? '0 0 0 32px' : '0 32px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,.1)' : 'none',
              }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.6rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  {s.num}<span style={{ color: '#f97316' }}>{s.suffix}</span>
                </div>
                <div style={{ fontSize: '.72rem', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginTop: 6 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section style={{ padding: '88px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ marginBottom: 48 }}>
            <SectionLabel>Why Learn With MAI Academy</SectionLabel>
            <SectionHeading>Education That <span style={{ color: '#f97316' }}>Opens Doors</span></SectionHeading>
            <SectionSub>Every course is built for real outcomes — skills, certification, and a direct path to leadership and opportunities.</SectionSub>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{
                display: 'flex', alignItems: 'flex-start', gap: 16,
                background: '#fff', border: '1px solid #E5E7EB',
                borderRadius: 14, padding: '24px 26px',
                transition: 'box-shadow .25s, transform .25s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(1,56,29,0.07)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'rgba(1,91,45,.1)', color: '#015b2d',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '1.25rem',
                }}>{b.icon}</div>
                <div>
                  <h6 style={{ fontFamily: "'Syne', sans-serif", fontSize: '.95rem', fontWeight: 700, marginBottom: 5 }}>{b.title}</h6>
                  <p style={{ fontSize: '.83rem', color: '#6B7280', lineHeight: 1.6, margin: 0, fontWeight: 300 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSE CATALOG ── */}
      <section id="courses" style={{ padding: '88px 0', background: '#F7F4EE' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ marginBottom: 48 }}>
            <SectionLabel>Course Catalog</SectionLabel>
            <SectionHeading>Explore Our <span style={{ color: '#f97316' }}>Courses</span></SectionHeading>
            <SectionSub>Pick a course, learn at your pace, and graduate ready to lead. Filter by track to find your fit.</SectionSub>
          </div>

          {/* Filter bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 44 }}>
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{
                fontFamily: 'inherit', fontSize: '.75rem', fontWeight: 600,
                letterSpacing: '.06em', textTransform: 'uppercase',
                border: '1.5px solid', borderRadius: 50, padding: '9px 22px',
                cursor: 'pointer', transition: '.25s',
                background: activeFilter === f.key ? '#f97316' : '#fff',
                color: activeFilter === f.key ? '#fff' : '#6B7280',
                borderColor: activeFilter === f.key ? '#f97316' : '#E5E7EB',
              }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Course grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {filteredCourses.map(course => (
              <div key={course.id} style={{
                background: '#fff', border: '1px solid #E5E7EB',
                borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                transition: 'transform .3s, box-shadow .3s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,0,0,.09)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
              >
                {/* Card header */}
                <div style={{
                  height: 170, position: 'relative', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  padding: '18px 20px',
                  background: headerGradients[course.header],
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
                    fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
                    padding: '4px 11px', borderRadius: 50, background: 'rgba(255,255,255,.14)',
                    color: '#fff', border: '1px solid rgba(255,255,255,.2)', position: 'relative', zIndex: 1,
                  }}>
                    📊 {course.level}
                  </span>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', border: '1px solid rgba(255,255,255,.2)',
                  }}>{course.icon}</div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontSize: '6rem', fontWeight: 800, lineHeight: 1,
                    position: 'absolute', right: -8, bottom: -16,
                    color: 'rgba(255,255,255,.06)', userSelect: 'none', pointerEvents: 'none',
                  }}>{course.id}</div>
                </div>

                {/* Card body */}
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: '.66rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                    padding: '5px 14px', borderRadius: 4,
                  }} className={tagStyles[course.tagColor]}>
                    {course.tag}
                  </span>
                  <h5 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.02rem', fontWeight: 700, marginTop: 10, lineHeight: 1.4 }}>
                    {course.title}
                  </h5>
                  <p style={{ fontSize: '.85rem', color: '#6B7280', lineHeight: 1.7, marginTop: 8, flex: 1, fontWeight: 300 }}>
                    {course.desc}
                  </p>
                  {/* Meta */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 18, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
                    {[`🕐 ${course.weeks} Weeks`, `🎥 ${course.lessons} Lessons`, `👥 ${course.enrolled}`].map(m => (
                      <span key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.74rem', color: '#6B7280' }}>{m}</span>
                    ))}
                  </div>
                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, gap: 10 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#015b2d' }}>
                      FREE <small style={{ fontSize: '.68rem', color: '#6B7280', fontWeight: 400 }}>/ certified</small>
                    </div>
                    <a href="#enroll" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: '#f97316', color: '#fff',
                      fontSize: '.76rem', fontWeight: 600, letterSpacing: '.03em',
                      border: 'none', padding: '10px 18px', borderRadius: 8,
                      cursor: 'pointer', textDecoration: 'none',
                    }}>
                      Enroll →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '88px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ marginBottom: 48 }}>
            <SectionLabel>Simple Process</SectionLabel>
            <SectionHeading>How Enrollment <span style={{ color: '#f97316' }}>Works</span></SectionHeading>
            <SectionSub>Four easy steps from sign-up to certification. No paperwork stress, no hidden fees.</SectionSub>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {STEPS.map(s => (
              <div key={s.title} style={{
                background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16,
                padding: '32px 26px', position: 'relative', overflow: 'hidden',
                transition: 'transform .3s, box-shadow .3s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(1,56,29,0.07)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
              >
                <div style={{
                  width: 54, height: 54, borderRadius: 14,
                  background: 'rgba(249,115,22,.1)', color: '#f97316',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', marginBottom: 20,
                }}>{s.icon}</div>
                <h5 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.05rem', fontWeight: 700, marginBottom: 10 }}>{s.title}</h5>
                <p style={{ fontSize: '.875rem', color: '#6B7280', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENROLLMENT FORM ── */}
      <section id="enroll" style={{ padding: '88px 0', background: '#F7F4EE' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
          <div style={{
            background: '#01381d', borderRadius: 20, padding: '64px 56px',
            color: '#fff', position: 'relative', overflow: 'hidden',
          }}>
            {/* Grid overlay */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }} />
            {/* Glow */}
            <div style={{
              position: 'absolute', top: -60, right: -60,
              width: 300, height: 300, borderRadius: '50%', pointerEvents: 'none',
              background: 'radial-gradient(circle, rgba(249,115,22,.1) 0%, transparent 70%)',
            }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'center', position: 'relative', zIndex: 1 }}>
              {/* Left */}
              <div>
                <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#f97316', marginBottom: 10 }}>
                  Start Today
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-.02em' }}>
                  Enroll in a Course Now
                </h2>
                <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.92rem', lineHeight: 1.8, fontWeight: 300, marginTop: 12 }}>
                  Fill out the form to reserve your free spot. Our team will reach out within 48 hours to confirm your enrollment and next steps.
                </p>
                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['No fees, no hidden charges', 'Open to all Edo South residents', 'Flexible online & on-site learning'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.75)', fontSize: '.88rem', fontWeight: 300 }}>
                      <span style={{ color: '#f97316' }}>✅</span> {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — form */}
              <div>
                {enrollSubmitted ? (
                  <div style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 12, padding: '32px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 12 }}>🎉</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>Application Submitted!</div>
                    <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '.88rem', fontWeight: 300 }}>Our team will reach out within 48 hours to confirm your enrollment and next steps.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { label: 'Full Name', type: 'text', placeholder: 'e.g. John Osagie', value: enrollName, onChange: setEnrollName },
                      { label: 'Phone Number', type: 'tel', placeholder: '+234 ...', value: enrollPhone, onChange: setEnrollPhone },
                      { label: 'Email Address', type: 'email', placeholder: 'you@example.com', value: enrollEmail, onChange: setEnrollEmail },
                    ].map(field => (
                      <div key={field.label}>
                        <label style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginBottom: 6, display: 'block' }}>
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={field.value}
                          onChange={e => field.onChange(e.target.value)}
                          style={{
                            width: '100%', padding: '13px 16px', border: '1px solid rgba(255,255,255,.15)',
                            background: 'rgba(255,255,255,.06)', borderRadius: 8,
                            fontFamily: 'inherit', fontSize: '.88rem', color: '#fff', outline: 'none',
                          }}
                        />
                      </div>
                    ))}

                    {/* LGA select */}
                    <div>
                      <label style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginBottom: 6, display: 'block' }}>
                        Local Government Area
                      </label>
                      <select
                        defaultValue=""
                        value={enrollLga}
                        onChange={e => setEnrollLga(e.target.value)}
                        style={{
                          width: '100%', padding: '13px 16px', border: '1px solid rgba(255,255,255,.15)',
                          background: 'rgba(255,255,255,.06)', borderRadius: 8,
                          fontFamily: 'inherit', fontSize: '.88rem', color: '#fff', outline: 'none',
                        }}
                      >
                        <option value="" disabled>Select LGA</option>
                        {LGAS.map(l => <option key={l} value={l} style={{ color: '#111827' }}>{l}</option>)}
                      </select>
                    </div>

                    {/* Course select — full width */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginBottom: 6, display: 'block' }}>
                        Select a Course
                      </label>
                      <select
                        defaultValue=""
                        value={enrollCourse}
                        onChange={e => setEnrollCourse(e.target.value)}
                        style={{
                          width: '100%', padding: '13px 16px', border: '1px solid rgba(255,255,255,.15)',
                          background: 'rgba(255,255,255,.06)', borderRadius: 8,
                          fontFamily: 'inherit', fontSize: '.88rem', color: '#fff', outline: 'none',
                        }}
                      >
                        <option value="" disabled>Choose a course</option>
                        {COURSES.map(c => <option key={c.id} value={c.title} style={{ color: '#111827' }}>{c.title}</option>)}
                      </select>
                    </div>

                    {/* Submit */}
                    <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                      <button
                        onClick={handleEnrollSubmit}
                        style={{
                          width: '100%', padding: 15, border: 'none', borderRadius: 8,
                          background: '#f97316', color: '#fff',
                          fontFamily: 'inherit', fontWeight: 700, fontSize: '.9rem',
                          letterSpacing: '.03em', cursor: 'pointer',
                        }}
                      >
                        Submit Application →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '88px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ marginBottom: 48 }}>
            <SectionLabel>Questions?</SectionLabel>
            <SectionHeading>Frequently Asked <span style={{ color: '#f97316' }}>Questions</span></SectionHeading>
            <SectionSub>Everything you need to know before you enroll. Still unsure? Reach out to our support team.</SectionSub>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid #E5E7EB',
                borderRadius: 14, marginBottom: 14, overflow: 'hidden',
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 26px', cursor: 'pointer', background: 'none', border: 'none',
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '.95rem',
                    color: openFaq === i ? '#f97316' : '#111827', textAlign: 'left',
                  }}
                >
                  {faq.q}
                  <span style={{ color: '#f97316', transition: 'transform .25s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', flexShrink: 0, marginLeft: 16 }}>▾</span>
                </button>
                <div style={{
                  maxHeight: openFaq === i ? 260 : 0,
                  overflow: 'hidden', transition: 'max-height .3s ease, padding .3s ease',
                  padding: openFaq === i ? '0 26px 22px' : '0 26px',
                  color: '#6B7280', fontSize: '.88rem', lineHeight: 1.8, fontWeight: 300,
                }}>
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

// ── SMALL SHARED SUB-COMPONENTS ───────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '.68rem', fontWeight: 700, letterSpacing: '.16em',
      textTransform: 'uppercase', color: '#f97316',
      marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ display: 'inline-block', width: 20, height: 2, background: '#f97316', borderRadius: 2 }} />
      {children}
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: "'Syne', sans-serif",
      fontSize: 'clamp(1.9rem, 4.5vw, 2.6rem)',
      fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.1,
      color: '#111827', margin: 0,
    }}>
      {children}
    </h2>
  )
}

function SectionSub({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: '#6B7280', fontSize: '.92rem', lineHeight: 1.8, maxWidth: 500, marginTop: 12, fontWeight: 300 }}>
      {children}
    </p>
  )
}