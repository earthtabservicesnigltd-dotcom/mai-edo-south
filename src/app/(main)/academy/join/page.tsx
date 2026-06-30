'use client'

import { useState } from 'react'
import Link from 'next/link'

const LGAS = ['Egor', 'Ikpoba-Okha', 'Oredo', 'Ovia North East', 'Ovia South West', 'Orhionmwon']

const SCHOOLS = [
  { value: 'politics', icon: '🌐', label: 'School of Politics, Policy and Governance' },
  { value: 'leadership', icon: '📈', label: 'School of Leadership and Management' },
  { value: 'public-service', icon: '🏛️', label: 'School of Public Service' },
  { value: 'business', icon: '💼', label: 'School of Business and Entrepreneurship' },
  { value: 'tech', icon: '💻', label: 'School of Technology and Digital Skills' },
  { value: 'ai', icon: '🤖', label: 'School of Artificial Intelligence and Machine Learning' },
]

const inputCls = 'w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors bg-white'
const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5'

export default function AcademyJoinPage() {
  const [tab, setTab] = useState<'login' | 'register'>('register')
  const [gender, setGender] = useState('')
  const [online, setOnline] = useState('')
  const [voter, setVoter] = useState('')
  const [schools, setSchools] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loginSubmitted, setLoginSubmitted] = useState(false)

  function toggleSchool(val: string) {
    setSchools(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val])
  }

  return (
    <>
      {/* HERO */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #01381d 0%, #015b2d 60%, #01381d 100%)' }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            🎓 MAI Academy
          </div>
          <h1 className="font-heading text-5xl md:text-7xl text-white mb-4">
            Welcome to <span className="text-[#f97316]">MAI Academy</span>
          </h1>
          <p className="text-[#f97316] font-bold text-lg mb-3">Learning Today. Leading Tomorrow. Building A Nation.</p>
          <p className="text-white/70 text-base max-w-xl mx-auto mb-8">
            A platform for learning, leadership, innovation, mentorship, and personal development — built for the people of Edo South.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setTab('register')}
              className="bg-[#f97316] text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-[#f97316] transition-colors text-sm"
            >
              👤 Join the Academy
            </button>
            <Link href="/academy/hub" className="border-2 border-white/40 text-white font-bold px-6 py-3 rounded-xl hover:border-white transition-colors text-sm">
              ▦ Explore Courses
            </Link>
            <Link href="#" className="border-2 border-white/40 text-white font-bold px-6 py-3 rounded-xl hover:border-white transition-colors text-sm">
              👥 Become a Mentor
            </Link>
          </div>
        </div>
        <div className="absolute bottom-[-3px] left-0 right-0">
          <svg className="block w-full" viewBox="0 0 1440 80" fill="none">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 45C1200 40 1320 30 1380 25L1440 20V80H0Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* MAIN BODY */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* FORM COLUMN */}
            <div className="lg:col-span-2">

              {/* Tab switcher */}
              <div className="flex bg-white border border-gray-200 rounded-2xl p-1.5 mb-6 shadow-sm w-full">
                <button
                  onClick={() => setTab('login')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${tab === 'login' ? 'bg-[#01381d] text-white' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  🔐 Login
                </button>
                <button
                  onClick={() => setTab('register')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${tab === 'register' ? 'bg-[#01381d] text-white' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  👤 Join the Academy
                </button>
              </div>

              {/* LOGIN PANEL */}
              {tab === 'login' && (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-[#01381d] to-[#015b2d] px-7 py-7">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">🔒 Secure Login</div>
                    <h4 className="font-heading text-3xl text-white">Welcome Back</h4>
                    <p className="text-white/70 text-sm mt-1">Log in to access your MAI Academy dashboard and courses.</p>
                  </div>
                  <div className="p-7 space-y-5">
                    <div>
                      <label className={labelCls}>Email Address <span className="text-[#f97316]">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉️</span>
                        <input type="email" className={inputCls} placeholder="you@example.com" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className={labelCls + ' mb-0'}>Password <span className="text-[#f97316]">*</span></label>
                        <Link href="#" className="text-xs text-[#f97316] font-semibold">Forgot password?</Link>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                        <input type="password" className={inputCls} placeholder="Enter your password" />
                      </div>
                    </div>
                    {loginSubmitted ? (
                      <div className="bg-green-50 border border-green-200 text-green-700 font-bold text-sm py-3 px-4 rounded-xl text-center">✅ Logged in successfully!</div>
                    ) : (
                      <button
                        onClick={() => setLoginSubmitted(true)}
                        className="w-full bg-[#01381d] text-white font-bold py-3.5 rounded-xl hover:bg-[#f97316] transition-colors text-sm"
                      >
                        🔐 Log In to MAI Academy
                      </button>
                    )}
                    <div className="text-center text-xs text-gray-400 pt-2">
                      Not yet a member?{' '}
                      <button onClick={() => setTab('register')} className="text-[#f97316] font-bold">Join the Academy →</button>
                    </div>
                  </div>
                </div>
              )}

              {/* REGISTER PANEL */}
              {tab === 'register' && (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-[#01381d] to-[#015b2d] px-7 py-7">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">🎓 MAI Academy Enrollment</div>
                    <h4 className="font-heading text-3xl text-white">Join the MAI Academy</h4>
                    <p className="text-white/70 text-sm mt-1">Fill in your details below to enroll. All fields marked <span className="text-[#f97316]">*</span> are required.</p>
                  </div>
                  <div className="p-7 space-y-8">

                    {/* Personal Info */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#f97316] mb-4 flex items-center gap-2">
                        <span className="inline-block w-4 h-0.5 bg-[#f97316] rounded" />
                        Personal Information
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Full Name <span className="text-[#f97316]">*</span></label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span><input type="text" className={inputCls} placeholder="First and last name" /></div>
                        </div>
                        <div>
                          <label className={labelCls}>Phone Number <span className="text-[#f97316]">*</span></label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📞</span><input type="tel" className={inputCls} placeholder="+234 000 000 0000" /></div>
                        </div>
                        <div>
                          <label className={labelCls}>Email Address <span className="text-[#f97316]">*</span></label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉️</span><input type="email" className={inputCls} placeholder="you@example.com" /></div>
                        </div>
                        <div>
                          <label className={labelCls}>Date of Birth <span className="text-[#f97316]">*</span></label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📅</span><input type="date" className={inputCls} /></div>
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelCls}>Gender <span className="text-[#f97316]">*</span></label>
                          <div className="flex flex-wrap gap-3">
                            {['Male', 'Female', 'Prefer not to say'].map(g => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setGender(g)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${gender === g ? 'border-[#01381d] bg-[#01381d]/5 text-[#01381d]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                              >
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${gender === g ? 'border-[#01381d]' : 'border-gray-300'}`}>
                                  {gender === g && <span className="w-2 h-2 rounded-full bg-[#01381d] block" />}
                                </span>
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#f97316] mb-4 flex items-center gap-2">
                        <span className="inline-block w-4 h-0.5 bg-[#f97316] rounded" />
                        Location & Residence
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>LGA of Origin <span className="text-[#f97316]">*</span></label>
                          <select defaultValue="" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors bg-white">
                            <option value="" disabled>Select LGA of origin</option>
                            {LGAS.map(l => <option key={l}>{l}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>LGA of Residence <span className="text-[#f97316]">*</span></label>
                          <select defaultValue="" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors bg-white">
                            <option value="" disabled>Select LGA of residence</option>
                            {LGAS.map(l => <option key={l}>{l}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Ward</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📍</span><input type="text" className={inputCls} placeholder="Enter your ward" /></div>
                        </div>
                        <div>
                          <label className={labelCls}>Residential Address <span className="text-[#f97316]">*</span></label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🏠</span><input type="text" className={inputCls} placeholder="Street address, city" /></div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Questions */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#f97316] mb-4 flex items-center gap-2">
                        <span className="inline-block w-4 h-0.5 bg-[#f97316] rounded" />
                        A Few Quick Questions
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={labelCls}>Available for online training? <span className="text-[#f97316]">*</span></label>
                          <div className="flex gap-3">
                            {['Yes', 'No'].map(v => (
                              <button key={v} type="button" onClick={() => setOnline(v)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${online === v ? 'border-[#01381d] bg-[#01381d]/5 text-[#01381d]' : 'border-gray-200 text-gray-600'}`}>
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${online === v ? 'border-[#01381d]' : 'border-gray-300'}`}>
                                  {online === v && <span className="w-2 h-2 rounded-full bg-[#01381d] block" />}
                                </span>
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Registered voter? <span className="text-[#f97316]">*</span></label>
                          <div className="flex gap-3">
                            {['Yes', 'No'].map(v => (
                              <button key={v} type="button" onClick={() => setVoter(v)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${voter === v ? 'border-[#01381d] bg-[#01381d]/5 text-[#01381d]' : 'border-gray-200 text-gray-600'}`}>
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${voter === v ? 'border-[#01381d]' : 'border-gray-300'}`}>
                                  {voter === v && <span className="w-2 h-2 rounded-full bg-[#01381d] block" />}
                                </span>
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelCls}>How did you hear about MAI Academy?</label>
                          <select defaultValue="" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors bg-white">
                            <option value="" disabled>Select an option</option>
                            {['Social Media (Facebook, Instagram, X)', 'Friend or Family', 'Community Event', 'MAI Campaign Outreach', 'Online Search', 'TV / Radio', 'Other'].map(o => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* School Interest */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#f97316] mb-1 flex items-center gap-2">
                        <span className="inline-block w-4 h-0.5 bg-[#f97316] rounded" />
                        Area of Interest
                      </div>
                      <p className="text-xs text-gray-400 mb-4">Select all that apply</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SCHOOLS.map(s => (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() => toggleSchool(s.value)}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${schools.includes(s.value) ? 'border-[#01381d] bg-[#01381d]/5' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <span className="text-xl shrink-0">{s.icon}</span>
                            <span className={`text-sm font-medium flex-1 leading-snug ${schools.includes(s.value) ? 'text-[#01381d]' : 'text-gray-700'}`}>{s.label}</span>
                            <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${schools.includes(s.value) ? 'border-[#01381d] bg-[#01381d]' : 'border-gray-300'}`}>
                              {schools.includes(s.value) && <span className="text-white text-xs">✓</span>}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    {submitted ? (
                      <div className="bg-green-50 border border-green-200 text-green-700 font-bold text-sm py-4 px-5 rounded-xl text-center">
                        ✅ Enrollment Submitted! We&apos;ll be in touch soon.
                      </div>
                    ) : (
                      <button
                        onClick={() => setSubmitted(true)}
                        className="w-full bg-[#01381d] text-white font-bold py-4 rounded-xl hover:bg-[#f97316] transition-colors text-sm"
                      >
                        📤 Submit Enrollment
                      </button>
                    )}

                    <div className="text-center text-xs text-gray-400">
                      Already a member?{' '}
                      <button onClick={() => setTab('login')} className="text-[#f97316] font-bold">Log in here →</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="space-y-5">
              {/* Vision card */}
              <div className="bg-[#01381d] rounded-2xl p-6 text-white">
                <p className="text-[#f97316] font-bold text-xs uppercase tracking-widest mb-3">Our Vision</p>
                <h5 className="font-heading text-2xl mb-3">MAI Academy</h5>
                <p className="text-white/70 text-sm leading-relaxed mb-6">To provide access to knowledge, leadership development, civic education, mentorship, and personal growth opportunities for people across Edo South and beyond.</p>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
                  {[{ num: '6+', label: 'Schools' }, { num: '500+', label: 'Training Slots' }, { num: 'Free', label: 'All Programs' }].map(s => (
                    <div key={s.label} className="text-center">
                      <div className="font-heading text-2xl text-[#f97316]">{s.num}</div>
                      <div className="text-white/60 text-xs mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schools preview */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#f97316]">🎓</span>
                  <span className="font-bold text-sm text-[#01381d]">Our Schools</span>
                </div>
                <div className="space-y-2">
                  {['Politics, Policy & Governance', 'Leadership & Management', 'Public Service', 'Business & Entrepreneurship', 'Technology & Digital Skills', 'AI & Machine Learning'].map(s => (
                    <div key={s} className="flex items-center gap-3 text-sm text-gray-600 py-1">
                      <span className="w-2 h-2 bg-[#f97316] rounded-full shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor CTA */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <p className="text-[#f97316] font-bold text-xs uppercase tracking-widest mb-2">Want to Give Back?</p>
                <h6 className="font-bold text-base text-[#01381d] mb-2">Become a Mentor</h6>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">Share your expertise, guide the next generation of Edo South leaders and change-makers.</p>
                <Link href="#" className="inline-block border-2 border-[#f97316] text-[#f97316] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#f97316] hover:text-white transition-colors">
                  Apply as Mentor →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}