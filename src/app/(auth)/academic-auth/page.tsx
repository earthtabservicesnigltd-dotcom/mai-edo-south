'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabaseBrowser } from '@/lib/supabase'
import { toast } from 'sonner'
import {
  User, UserCheck, Mail, Lock, Eye, EyeOff,
  Badge, GraduationCap, BookOpen, Calendar, BarChart2,
  Megaphone, ArrowRight
} from 'lucide-react'

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
  const [phone, setPhone] = useState('')


  // Data
  const [schools, setSchools] = useState<School[]>([])
  const selectedSchool = schools.find(s => s.slug === schoolSlug)

  useEffect(() => {
    fetch('/api/academy/schools')
      .then(r => r.json())
      .then(d => setSchools(d.schools ?? []))
      .catch(() => {})
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
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
    if (error) { setLoginError(error.message); setLoginLoading(false); return }
    toast.success('Login successful!')
    router.push('/academy')
  }




  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setSignupError('')
    if (!firstName || !lastName || !signupEmail || !signupPassword|| !phone || !schoolSlug || !courseSlug) {
      setSignupError('Please fill in all fields.'); return
    }
    if (signupPassword.length < 6) { setSignupError('Password must be at least 6 characters.'); return }
    if (signupPassword !== confirmPassword) { setSignupError('Passwords do not match.'); return }
    setSignupLoading(true)
    const res = await fetch('/api/academy/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email: signupEmail, phone, password: signupPassword, courseSlug }),
    })
    const data = await res.json()
    setSignupLoading(false)
    if (res.ok) { toast.success('Account created! You can now sign in.'); setTab('login') }
    else { setSignupError(data.error || 'Something went wrong') }
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
          <div className="inline-block mt-3.5 px-4 py-1.5 rounded-full text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#f97316] bg-[rgba(249,115,22,0.18)] border border-[rgba(249,115,22,0.35)]">Academic Portal</div>
          <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
            {tab === 'login' ? (
              <div>
                <h2 className="font-['Bebas_Neue'] text-[clamp(38px,4vw,58px)] text-white leading-[1.05] mb-5">
                  ACCESS YOUR<br /><span className="text-[#f97316]">ACADEMIC SPACE.</span>
                </h2>
                <p className="text-white/75 text-[0.97rem] leading-[1.8] max-w-[420px] mb-9">Sign in to reach your student dashboard, course materials, announcements, results, timetable, and other academic services in one secure place.</p>
              </div>
            ) : (
              <div>
                <h2 className="font-['Bebas_Neue'] text-[clamp(38px,4vw,58px)] text-white leading-[1.05] mb-5">
                  CREATE YOUR<br /><span className="text-[#f97316]">ACADEMIC ACCOUNT.</span>
                </h2>
                <p className="text-white/75 text-[0.97rem] leading-[1.8] max-w-[420px] mb-9">Join the portal to access your dashboard, course materials, announcements, results, timetable, and other academic services in one secure place.</p>
                <div className="flex flex-col gap-3.5">
                  {[
                    { icon: BookOpen, label: 'Course Materials & Resources' },
                    { icon: Calendar, label: 'Timetable & Academic Calendar' },
                    { icon: BarChart2, label: 'Results, Records & Progress' },
                    { icon: Megaphone, label: 'Announcements & Student Updates' },
                  ].map((p, i) => {
                    const Icon = p.icon
                    return (
                      <div key={i} className="flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-[10px] px-4 py-3 max-w-[380px] hover:bg-white/10 transition-colors">
                        <div className="w-[34px] h-[34px] bg-[#f97316] rounded-lg flex items-center justify-center text-white shrink-0">
                          <Icon size={16} />
                        </div>
                        <span className="text-white/90 text-[0.86rem] font-semibold tracking-[0.02em]">{p.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}


            </div>
        </div>



        <p className="relative z-10 text-white/40 text-[0.75rem] tracking-[0.04em]">© 2026 MAI Edo South Academic Portal. All Rights Reserved.</p>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className="flex-1 flex items-start justify-center px-6 py-12 lg:px-10">
        <div className="w-full max-w-[440px]">

          <div className="md:hidden flex items-center justify-center flex-col py-8">
            <Image src="/image_4.png" alt="MAI Logo" width={70} height={70} className="h-[70px] w-auto" />
            <div className="inline-block mt-3.5 px-4 py-1.5 rounded-full text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#f97316] bg-[rgba(249,115,22,0.18)] border border-[rgba(249,115,22,0.35)]">Academic Portal</div>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#f5f5f5] rounded-xl p-[5px] mb-7 gap-1">
            <button onClick={() => setTab('login')}
              className={`flex-1 text-center py-2.5 rounded-lg text-[0.88rem] font-bold tracking-[0.04em] uppercase transition-all ${tab === 'login' ? 'bg-[#01381d] text-white shadow-[0_4px_14px_rgba(1,56,29,0.25)]' : 'text-[#6b7280] hover:text-[#374151]'}`}>Sign In</button>
            <button onClick={() => setTab('signup')}
              className={`flex-1 text-center py-2.5 rounded-lg text-[0.88rem] font-bold tracking-[0.04em] uppercase transition-all ${tab === 'signup' ? 'bg-[#01381d] text-white shadow-[0_4px_14px_rgba(1,56,29,0.25)]' : 'text-[#6b7280] hover:text-[#374151]'}`}>Sign Up</button>
          </div>

          {/* ─── LOGIN ─── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <span className="text-[#015b2d] text-[0.75rem] font-bold tracking-[0.2em] uppercase block mb-2.5 text-center">Student Portal Access</span>
              <h1 className="font-['Bebas_Neue'] text-[2.8rem] tracking-[0.04em] text-[#111] leading-none mb-2 text-center">Sign <span className="text-[#f97316]">In</span></h1>
              <p className="text-[#6b7280] text-[0.95rem] mb-7 text-center">Enter your academic details to continue to the portal.</p>

              {loginError && <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-sm text-red-600 mb-5">{loginError}</div>}

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[#e5e7eb]" />
                <span className="text-[#9ca3af] text-[0.85rem]">or sign in with email</span>
                <div className="flex-1 h-px bg-[#e5e7eb]" />
              </div>

              <div className="space-y-[18px]">
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Student ID / Email</label>
                  <div className="relative">
                    <Badge size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                    <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] text-[#111827] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="e.g. email@example.com" />
                  </div>
                </div>
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                    <input type={showLoginPass ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="Enter your password" />
                    {showLoginPass
                      ? <EyeOff size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] cursor-pointer hover:text-[#015b2d]" onClick={() => setShowLoginPass(false)} />
                      : <Eye size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] cursor-pointer hover:text-[#015b2d]" onClick={() => setShowLoginPass(true)} />
                    }
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
                className="w-full py-3.5 bg-[#01381d] text-white rounded-xl font-bold text-[0.92rem] tracking-[0.08em] uppercase hover:bg-[#015b2d] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(1,56,29,0.25)] transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2">
                {loginLoading ? 'Signing in...' : 'Login to Portal'} <ArrowRight size={16} />
              </button>

              <p className="text-center text-[0.9rem] text-[#6b7280] mt-4">
                New here? <button type="button" onClick={() => setTab('signup')} className="text-[#f97316] font-bold bg-none border-none cursor-pointer hover:text-[#01381d]">Create an account</button>
              </p>
            </form>
          )}

          {/* ─── SIGNUP ─── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignup}>
              <span className="text-[#015b2d] text-[0.75rem] font-bold tracking-[0.2em] uppercase block mb-2.5 text-center">Student Registration</span>
              <h1 className="font-['Bebas_Neue'] text-[2.8rem] tracking-[0.04em] text-[#111] leading-none mb-2 text-center">Sign <span className="text-[#f97316]">Up</span></h1>
              <p className="text-[#6b7280] text-[0.95rem] mb-7 text-center">Create your account to continue to the portal.</p>

              {signupError && <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-sm text-red-600 mb-5">{signupError}</div>}

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[#e5e7eb]" />
                <span className="text-[#9ca3af] text-[0.85rem]">or sign up</span>
                <div className="flex-1 h-px bg-[#e5e7eb]" />
              </div>

              <div className="space-y-[18px]">
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">First Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="Enter your first name" />
                  </div>
                </div>
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Last Name</label>
                  <div className="relative">
                    <UserCheck size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="Enter your last name" />
                  </div>
                </div>
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                    <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="e.g. email@example.com" />
                  </div>
                </div>
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Phone Number</label>
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="+234 800 0000 000" />
                  </div>
                </div>

                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">School</label>
                  <div className="relative">
                    <GraduationCap size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] z-10" />
                    <select 
                      value={schoolSlug} 
                      onChange={e => { 
                        setSchoolSlug(e.target.value); 
                        const school = schools.find(s => s.slug === e.target.value);
                        if (school?.courses?.[0]) setCourseSlug(school.courses[0].slug);
                      }}

                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white appearance-none">
                      <option value="">Choose your school</option>
                      {schools.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                    <input type={showSignupPass ? 'text' : 'password'} value={signupPassword} onChange={e => setSignupPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="Create a password" />
                    {showSignupPass
                      ? <EyeOff size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] cursor-pointer hover:text-[#015b2d]" onClick={() => setShowSignupPass(false)} />
                      : <Eye size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] cursor-pointer hover:text-[#015b2d]" onClick={() => setShowSignupPass(true)} />
                    }
                  </div>
                </div>
                <div>
                  <label className="text-[0.82rem] font-bold text-[#374151] tracking-[0.05em] uppercase block mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-[#e5e7eb] rounded-xl bg-[#fafafa] text-[0.95rem] outline-none focus:border-[#015b2d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,91,45,0.08)]"
                      placeholder="Confirm your password" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={signupLoading}
                className="w-full mt-5 py-3.5 bg-[#01381d] text-white rounded-xl font-bold text-[0.92rem] tracking-[0.08em] uppercase hover:bg-[#015b2d] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(1,56,29,0.25)] transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2">
                {signupLoading ? 'Creating account...' : 'Create Account'} <ArrowRight size={16} />
              </button>

              <p className="text-center text-[0.9rem] text-[#6b7280] mt-4">
                Already have an account? <button type="button" onClick={() => setTab('login')} className="text-[#f97316] font-bold bg-none border-none cursor-pointer hover:text-[#01381d]">Sign in</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
