'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabaseBrowser } from '@/lib/supabase'
import { toast } from 'sonner'

interface School {
  slug: string
  title: string
  courses: Course[]
}

interface Course {
  id: string
  slug: string
  title: string
  short_label: string
}

export default function AcademicAuthPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'signup'>('login')

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Signup state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [schoolSlug, setSchoolSlug] = useState('')
  const [courseSlug, setCourseSlug] = useState('')
  const [showSignupPass, setShowSignupPass] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupError, setSignupError] = useState('')

  // Data
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  const selectedSchool = schools.find(s => s.slug === schoolSlug)

  useEffect(() => {
    fetch('/api/academy/schools')
      .then(r => r.json())
      .then(d => {
        setSchools(d.schools ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields.')
      return
    }
    setLoginLoading(true)
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })
    if (error) {
      setLoginError(error.message)
      setLoginLoading(false)
      return
    }
    toast.success('Login successful!')
    router.push('/academy')
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setSignupError('')
    if (!firstName || !lastName || !signupEmail || !signupPassword || !schoolSlug || !courseSlug) {
      setSignupError('Please fill in all fields.')
      return
    }
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters.')
      return
    }
    if (signupPassword !== confirmPassword) {
      setSignupError('Passwords do not match.')
      return
    }
    setSignupLoading(true)
    const res = await fetch('/api/academy/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email: signupEmail, password: signupPassword, courseSlug }),
    })
    const data = await res.json()
    setSignupLoading(false)
    if (res.ok) {
      toast.success('Account created! You can now sign in.')
      setTab('login')
    } else {
      setSignupError(data.error || 'Something went wrong')
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f7f8fa] w-full">

      {/* ─── LEFT PANEL ─── */}
      <div className="hidden lg:flex w-[52%] bg-gradient-to-br from-[#01381d] via-[#015b2d] to-[#024d25] flex-col justify-between px-14 py-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#f97316] opacity-[0.07]" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-white opacity-[0.04]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.06]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-white/[0.06]" />

        <div className="relative z-10">
          <Image src="/image_4.png" alt="MAI Logo" width={70} height={70} className="h-[70px] w-auto" />
          <div className="inline-block mt-3.5 px-4 py-1.5 rounded-full text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#f97316] bg-[rgba(249,115,22,0.18)] border border-[rgba(249,115,22,0.35)]">
            Academic Portal
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
          {tab === 'login' ? (
            <div>
              <h2 className="font-['Bebas_Neue'] text-[clamp(38px,4vw,58px)] text-white leading-[1.05] mb-5">
                ACCESS YOUR<br /><span className="text-[#f97316]">ACADEMIC SPACE.</span>
              </h2>
              <p className="text-white/75 text-[0.97rem] leading-[1.8] max-w-[420px] mb-9">
                Sign in to reach your student dashboard, course materials, announcements, results, timetable, and other academic services in one secure place.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="font-['Bebas_Neue'] text-[clamp(38px,4vw,58px)] text-white leading-[1.05] mb-5">
                CREATE YOUR<br /><span className="text-[#f97316]">ACADEMIC ACCOUNT.</span>
              </h2>
              <p className="text-white/75 text-[0.97rem] leading-[1.8] max-w-[420px] mb-9">
                Join the portal to access your dashboard, course materials, announcements, results, timetable, and other academic services in one secure place.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3.5">
            {[
              { icon: 'ti ti-book-2', label: 'Course Materials & Resources' },
              { icon: 'ti ti-calendar-week', label: 'Timetable & Academic Calendar' },
              { icon: 'ti ti-chart-bar', label: 'Results, Records & Progress' },
              { icon: 'ti ti-bullhorn', label: 'Announcements & Student Updates' },
            ].map((p, i) => (
              <div key={i}
                className="flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-[10px] px-4 py-3 max-w-[380px] hover:bg-white/10 transition-colors">
                <div className="w-[34px] h-[34px] bg-[#f97316] rounded-lg flex items-center justify-center text-white text-[15px] shrink-0">
                  <i className={p.icon} />
                </div>
                <span className="text-white/90 text-[0.86rem] font-semibold tracking-[0.02em]">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/40 text-[0.75rem] tracking-[0.04em]">
          © 2026 MAI Edo South Academic Portal. All Rights Reserved.
        </p>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className="flex-1 flex items-start justify-center px-6 py-12 lg:px-10">
        <div className="w-full max-w-[440px]">
          
        <div className="md:hidden flex items-center justify-center flex-col py-8">
          <Image src="/image_4.png" alt="MAI Logo" width={70} height={70} className="h-[70px] w-auto" />
          <div className="inline-block mt-3.5 px-4 py-1.5 rounded-full text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#f97316] bg-[rgba(249,115,22,0.18)] border border-[rgba(249,115,22,0.35)]">
            Academic Portal
          </div>
        </div>

          {/* Tabs */}
          <div className="flex bg-[#f5f5f5] rounded-xl p-[5px] mb-7 gap-1">
            <button onClick={() => setTab('login')}
              className={`flex-1 text-center py-2.5 rounded-lg text-[0.88rem] font-bold tracking-[0.04em] uppercase transition-all
                ${tab === 'login' ? 'bg-[#01381d] text-white shadow-[0_4px_14px_rgba(1,56,29,0.25)]' : 'text-[#6b7280] hover:text-[#374151]'}`}>
              Sign In
            </button>
            <button onClick={() => setTab('signup')}
              className={`flex-1 text-center py-2.5 rounded-lg text-[0.88rem] font-bold tracking-[0.04em] uppercase transition-all
                ${tab === 'signup' ? 'bg-[#01381d] text-white shadow-[0_4px_14px_rgba(1,56,29,0.25)]' : 'text-[#6b7280] hover:text-[#374151]'}`}>
              Sign Up
            </button>
          </div>

          {/* ─── LOGIN ─── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <span className="text-[#015b2d] text-[0.75rem] font-bold tracking-[0.2em] uppercase block mb-2.5 text-center">Student Portal Access</span>
              <h1 className="font-['Bebas_Neue'] text-[2.8rem] tracking-[0.04em] text-[#111] leading-none mb-2 text-center">
                Sign <span className="text-[#f97316]">In</span>
              </h1>
              <p className="text-[#6b7280] text-[0.95rem] mb-7">Enter your academic details to continue to the portal.</p>

              {loginError && <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-sm text-red-600 mb-5">{loginError}</div>}

              <div className="space-y-[18px]">
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Student ID / Email</label>
                  <div className="relative">
                    <i className="ti ti-id-badge absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] text-lg" />
                    <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] text-[#111827] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="e.g. email@example.com" />
                  </div>
                </div>
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Password</label>
                  <div className="relative">
                    <i className="ti ti-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] text-lg" />
                    <input type={showLoginPass ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="Enter your password" />
                    <i className={`ti ${showLoginPass ? 'ti-eye-off' : 'ti-eye'} absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] cursor-pointer hover:text-[#015b2d] text-lg`}
                      onClick={() => setShowLoginPass(!showLoginPass)} />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center gap-3 mt-3 mb-5 flex-wrap">
                <label className="flex items-center gap-2 text-[#4b5563] text-[0.9rem]">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="accent-[#015b2d]" /> Remember me
                </label>
                <a href="/forgot-password" className="text-[#f97316] text-[0.9rem] font-semibold hover:text-[#01381d] no-underline">Forgot password?</a>
              </div>

              <button type="submit" disabled={loginLoading}
                className="w-full py-3.5 bg-[#01381d] text-white rounded-xl font-bold text-[0.92rem] tracking-[0.08em] uppercase hover:bg-[#015b2d] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(1,56,29,0.25)] transition-all disabled:opacity-60">
                {loginLoading ? 'Signing in...' : 'Login to Portal'} <i className="ti ti-arrow-right ml-1" />
              </button>

              <p className="text-center text-[0.9rem] text-[#6b7280] mt-4">
                New here?{' '}
                <button type="button" onClick={() => setTab('signup')} className="text-[#f97316] font-bold bg-none border-none cursor-pointer hover:text-[#01381d]">Create an account</button>
              </p>
            </form>
          )}

          {/* ─── SIGNUP ─── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignup}>
              <span className="text-[#015b2d] text-[0.75rem] font-bold tracking-[0.2em] uppercase block mb-2.5 text-center">Student Registration</span>
              <h1 className="font-['Bebas_Neue'] text-[2.8rem] tracking-[0.04em] text-[#111] leading-none mb-2 text-center">
                Sign <span className="text-[#f97316]">Up</span>
              </h1>
              <p className="text-[#6b7280] text-[0.95rem] mb-7">Create your account to continue to the portal.</p>

              {signupError && <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-sm text-red-600 mb-5">{signupError}</div>}

              <div className="space-y-[18px]">
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">First Name</label>
                  <div className="relative">
                    <i className="ti ti-user absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] text-lg" />
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="Enter your first name" />
                  </div>
                </div>
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Last Name</label>
                  <div className="relative">
                    <i className="ti ti-user-check absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] text-lg" />
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="Enter your last name" />
                  </div>
                </div>
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Email</label>
                  <div className="relative">
                    <i className="ti ti-mail absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] text-lg" />
                    <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="e.g. email@example.com" />
                  </div>
                </div>
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">School</label>
                  <div className="relative">
                    <i className="ti ti-school absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] text-lg z-10" />
                    <select value={schoolSlug} onChange={e => { setSchoolSlug(e.target.value); setCourseSlug('') }}
                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white appearance-none">
                      <option value="">Choose your school</option>
                      {schools.map(s => (<option key={s.slug} value={s.slug}>{s.title}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Course</label>
                  <div className="relative">
                    <i className="ti ti-book absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] text-lg z-10" />
                    <select value={courseSlug} onChange={e => setCourseSlug(e.target.value)} disabled={!schoolSlug}
                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white appearance-none disabled:opacity-50">
                      <option value="">{schoolSlug ? 'Choose a course...' : 'Select a school first'}</option>
                      {(selectedSchool?.courses ?? []).map(c => (<option key={c.slug} value={c.slug}>{c.short_label} — {c.title}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Password</label>
                  <div className="relative">
                    <i className="ti ti-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] text-lg" />
                    <input type={showSignupPass ? 'text' : 'password'} value={signupPassword} onChange={e => setSignupPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="Create a password" />
                    <i className={`ti ${showSignupPass ? 'ti-eye-off' : 'ti-eye'} absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] cursor-pointer hover:text-[#015b2d] text-lg`}
                      onClick={() => setShowSignupPass(!showSignupPass)} />
                  </div>
                </div>
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Confirm Password</label>
                  <div className="relative">
                    <i className="ti ti-lock-check absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] text-lg" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="Confirm your password" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={signupLoading}
                className="w-full mt-5 py-3.5 bg-[#01381d] text-white rounded-xl font-bold text-[0.92rem] tracking-[0.08em] uppercase hover:bg-[#015b2d] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(1,56,29,0.25)] transition-all disabled:opacity-60">
                {signupLoading ? 'Creating account...' : 'Create Account'} <i className="ti ti-arrow-right ml-1" />
              </button>

              <p className="text-center text-[0.9rem] text-[#6b7280] mt-4">
                Already have an account?{' '}
                <button type="button" onClick={() => setTab('login')} className="text-[#f97316] font-bold bg-none border-none cursor-pointer hover:text-[#01381d]">Sign in</button>
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
