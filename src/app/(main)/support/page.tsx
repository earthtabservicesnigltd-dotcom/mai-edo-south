// app/support-group/page.tsx
'use client'

import { useState } from 'react'
import {
  Users,
  ShieldCheck,
  Megaphone,
  Clock,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────
type FormData = {
  // Step 1 – Organization
  orgName: string
  acronym: string
  orgType: string
  yearEstablished: string
  state: string
  lga: string
  ward: string
  community: string
  // Step 2 – Leadership
  coordinatorName: string
  position: string
  phone: string
  whatsapp: string
  email: string
  // Step 3 – Membership
  totalMembers: string
  activeMembers: string
  estimatedSupporters: string
  // Step 4 – Database upload
  membershipDatabase: File | null
  // Step 5 – Online presence & docs
  facebook: string
  twitter: string
  instagram: string
  website: string
  groupLogo: File | null
  certOfReg: File | null
  constitution: File | null
  groupPhoto: File | null
  // Step 6 – Declaration
  agreed: boolean
}

const INITIAL: FormData = {
  orgName: '', acronym: '', orgType: 'Political Support Group',
  yearEstablished: '', state: '', lga: '', ward: '', community: '',
  coordinatorName: '', position: '', phone: '', whatsapp: '', email: '',
  totalMembers: '', activeMembers: '', estimatedSupporters: '',
  membershipDatabase: null,
  facebook: '', twitter: '', instagram: '', website: '',
  groupLogo: null, certOfReg: null, constitution: null, groupPhoto: null,
  agreed: false,
}

const STEP_LABELS = [
  'Organization',
  'Leadership',
  'Membership',
  'Database',
  'Online & Docs',
  'Declaration',
]

const WHY_ITEMS = [
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Stronger Coordination',
    desc: 'Connect your group to the larger Edo South structure.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Verified Records',
    desc: 'Help us keep accurate and trusted organizational data.',
  },
  {
    icon: <Megaphone className="w-5 h-5" />,
    title: 'Better Visibility',
    desc: 'Your group can be included in updates, engagements and campaigns.',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Quick Review',
    desc: 'Our team will review your submission and respond after verification.',
  },
]

// ── Shared input styles ──────────────────────────────────
const inputCls =
  'w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm focus:outline-none focus:border-orange-400 transition-colors'
const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5'

// ── File input helper ────────────────────────────────────
function FileInput({
  label,
  optional,
  onChange,
}: {
  label: string
  optional?: boolean
  onChange: (f: File | null) => void
}) {
  return (
    <div>
      <label className={labelCls}>
        {label}
        {optional && <span className="font-normal text-gray-400 ml-1">(Optional)</span>}
      </label>
      <input
        type="file"
        className={inputCls + ' cursor-pointer'}
        onChange={e => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  )
}

// ── Main page ────────────────────────────────────────────
export default function SupportGroupPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = STEP_LABELS.length
  const isLast = step === totalSteps - 1

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function next() {
    if (step < totalSteps - 1) setStep(s => s + 1)
    else handleSubmit()
  }

  function prev() {
    if (step > 0) setStep(s => s - 1)
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const fileToBase64 = (file: File | null): Promise<string> => {
        return new Promise((resolve, reject) => {
          if (!file) return resolve('')
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      const [
        membershipDatabaseBase64,
        groupLogoBase64,
        certOfRegBase64,
        constitutionBase64,
        groupPhotoBase64,
      ] = await Promise.all([
        fileToBase64(form.membershipDatabase),
        fileToBase64(form.groupLogo),
        fileToBase64(form.certOfReg),
        fileToBase64(form.constitution),
        fileToBase64(form.groupPhoto),
      ])

      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_name: form.orgName,
          acronym: form.acronym,
          org_type: form.orgType,
          year_established: form.yearEstablished,
          state: form.state,
          lga: form.lga,
          ward: form.ward,
          community: form.community,
          coordinator_name: form.coordinatorName,
          position: form.position,
          phone: form.phone,
          whatsapp: form.whatsapp,
          email: form.email,
          total_members: form.totalMembers,
          active_members: form.activeMembers,
          estimated_supporters: form.estimatedSupporters,
          facebook: form.facebook,
          twitter: form.twitter,
          instagram: form.instagram,
          website: form.website,
          agreed: form.agreed,
          membershipDatabaseBase64,
          membershipDatabaseName: form.membershipDatabase?.name,
          groupLogoBase64,
          groupLogoName: form.groupLogo?.name,
          certOfRegBase64,
          certOfRegName: form.certOfReg?.name,
          constitutionBase64,
          constitutionName: form.constitution?.name,
          groupPhotoBase64,
          groupPhotoName: form.groupPhoto?.name,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')

      setSubmitted(true)
    } catch (err: any) {
      alert(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f7f4ee] px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-10 max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#015b2d]/10 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-8 h-8 text-[#015b2d]" />
          </div>
          <h2 className="font-heading text-3xl mb-3">Submission Received!</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Thank you for registering your support group. Our team will review your
            submission and get back to you after verification.
          </p>
          <button
            onClick={() => { setSubmitted(false); setStep(0); setForm(INITIAL) }}
            className="mt-7 bg-[#f97316] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#015b2d] transition-colors text-sm"
          >
            Register Another Group
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="py-24 px-4 text-white relative overflow-hidden"
        style={{
          background:
            'linear-gradient(rgba(1,56,29,.92), rgba(1,56,29,.92)), url(/images/image-edited.png) center/cover no-repeat',
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-3">
            Register Your Support Group
          </p>
          <h1 className="font-heading text-5xl md:text-7xl leading-none mb-4">
            Support Group{' '}
            <span className="text-[#f97316]">Registration</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl">
            Join the growing coalition committed to the progress, development and
            advancement of Edo South.
          </p>
        </div>
      </section>

      {/* ── Form + Sidebar ── */}
      <section className="py-20 bg-[#f7f4ee] px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── Form shell ── */}
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_12px_35px_rgba(1,56,29,0.08)]">

              {/* Form header */}
              <div className="bg-gradient-to-r from-[#01381d] to-[#015b2d] text-white px-7 py-7">
                <h4 className="font-heading text-3xl tracking-wide mb-1">Registration Portal</h4>
                <p className="text-white/80 text-sm">Complete the steps below to submit your organization details.</p>
              </div>

              {/* Form body */}
              <div className="p-7">

                {/* Step dots */}
                <div className="flex flex-wrap gap-2.5 mb-7">
                  {STEP_LABELS.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => setStep(i)}
                      title={label}
                      className={`w-9 h-9 rounded-full text-sm font-bold transition-colors
                        ${i === step
                          ? 'bg-[#f97316] text-white'
                          : i < step
                            ? 'bg-[#015b2d] text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {/* Steps */}
                <div className="animate-fadeIn">

                  {/* STEP 1 – Organization */}
                  {step === 0 && (
                    <StepCard
                      title="ORGANIZATION INFORMATION"
                      desc="Register your organization and become part of a growing coalition committed to the progress, development and advancement of Edo South."
                    >
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className={labelCls}>Name of Support Group / Organization</label>
                          <input className={inputCls} placeholder="Enter organization name"
                            value={form.orgName} onChange={e => set('orgName', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>Acronym</label>
                            <input className={inputCls} placeholder="If any"
                              value={form.acronym} onChange={e => set('acronym', e.target.value)} />
                          </div>
                          <div>
                            <label className={labelCls}>Organization Type</label>
                            <select className={inputCls} value={form.orgType}
                              onChange={e => set('orgType', e.target.value)}>
                              {['Political Support Group','Youth Organization','Women Organization',
                                'Community Association','Professional Association','Student Organization',
                                'Diaspora Group','Market Association','Religious Group','Other'
                              ].map(o => <option key={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Year Established</label>
                            <input className={inputCls} placeholder="e.g. 2020"
                              value={form.yearEstablished} onChange={e => set('yearEstablished', e.target.value)} />
                          </div>
                          <div>
                            <label className={labelCls}>State of Operation</label>
                            <input className={inputCls} placeholder="State"
                              value={form.state} onChange={e => set('state', e.target.value)} />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className={labelCls}>LGA(s) Covered</label>
                            <input className={inputCls} placeholder="LGA(s)"
                              value={form.lga} onChange={e => set('lga', e.target.value)} />
                          </div>
                          <div>
                            <label className={labelCls}>Ward(s) Covered</label>
                            <input className={inputCls} placeholder="Ward(s)"
                              value={form.ward} onChange={e => set('ward', e.target.value)} />
                          </div>
                          <div>
                            <label className={labelCls}>Community / Area of Operation</label>
                            <input className={inputCls} placeholder="Community / Area"
                              value={form.community} onChange={e => set('community', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </StepCard>
                  )}

                  {/* STEP 2 – Leadership */}
                  {step === 1 && (
                    <StepCard
                      title="LEADERSHIP INFORMATION"
                      desc="Provide the main contact information for your organization."
                    >
                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>Name of Coordinator / President</label>
                            <input className={inputCls} placeholder="Full name"
                              value={form.coordinatorName} onChange={e => set('coordinatorName', e.target.value)} />
                          </div>
                          <div>
                            <label className={labelCls}>Position</label>
                            <input className={inputCls} placeholder="e.g. President"
                              value={form.position} onChange={e => set('position', e.target.value)} />
                          </div>
                          <div>
                            <label className={labelCls}>Phone Number</label>
                            <input className={inputCls} placeholder="Phone number"
                              value={form.phone} onChange={e => set('phone', e.target.value)} />
                          </div>
                          <div>
                            <label className={labelCls}>WhatsApp Number</label>
                            <input className={inputCls} placeholder="WhatsApp number"
                              value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Email Address</label>
                          <input type="email" className={inputCls} placeholder="Email address"
                            value={form.email} onChange={e => set('email', e.target.value)} />
                        </div>
                      </div>
                    </StepCard>
                  )}

                  {/* STEP 3 – Membership */}
                  {step === 2 && (
                    <StepCard
                      title="MEMBERSHIP INFORMATION"
                      desc="Tell us the size and strength of your support base."
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className={labelCls}>Total Registered Members</label>
                          <input className={inputCls} placeholder="Number"
                            value={form.totalMembers} onChange={e => set('totalMembers', e.target.value)} />
                        </div>
                        <div>
                          <label className={labelCls}>Active Members</label>
                          <input className={inputCls} placeholder="Number"
                            value={form.activeMembers} onChange={e => set('activeMembers', e.target.value)} />
                        </div>
                        <div>
                          <label className={labelCls}>Estimated Supporters</label>
                          <input className={inputCls} placeholder="Number"
                            value={form.estimatedSupporters} onChange={e => set('estimatedSupporters', e.target.value)} />
                        </div>
                      </div>
                    </StepCard>
                  )}

                  {/* STEP 4 – Database upload */}
                  {step === 3 && (
                    <StepCard
                      title="MEMBERSHIP DATABASE UPLOAD"
                      desc="Accepted formats: Excel (.xlsx), CSV (.csv), PDF, MS Word."
                    >
                      <FileInput
                        label="Upload Membership Database"
                        onChange={f => set('membershipDatabase', f)}
                      />
                    </StepCard>
                  )}

                  {/* STEP 5 – Online presence & docs */}
                  {step === 4 && (
                    <StepCard
                      title="ONLINE PRESENCE & DOCUMENT UPLOADS"
                      desc="Share your online presence and supporting documents."
                    >
                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>Facebook Page</label>
                            <input className={inputCls} placeholder="Facebook URL"
                              value={form.facebook} onChange={e => set('facebook', e.target.value)} />
                          </div>
                          <div>
                            <label className={labelCls}>X (Twitter) Handle</label>
                            <input className={inputCls} placeholder="@handle"
                              value={form.twitter} onChange={e => set('twitter', e.target.value)} />
                          </div>
                          <div>
                            <label className={labelCls}>Instagram Handle</label>
                            <input className={inputCls} placeholder="@instagram"
                              value={form.instagram} onChange={e => set('instagram', e.target.value)} />
                          </div>
                          <div>
                            <label className={labelCls}>Website</label>
                            <input className={inputCls} placeholder="Optional"
                              value={form.website} onChange={e => set('website', e.target.value)} />
                          </div>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FileInput label="Group Logo" onChange={f => set('groupLogo', f)} />
                          <FileInput label="Certificate of Registration" optional onChange={f => set('certOfReg', f)} />
                          <FileInput label="Constitution" optional onChange={f => set('constitution', f)} />
                          <FileInput label="Group Photograph" optional onChange={f => set('groupPhoto', f)} />
                        </div>
                      </div>
                    </StepCard>
                  )}

                  {/* STEP 6 – Declaration */}
                  {step === 5 && (
                    <StepCard
                      title="DECLARATION"
                      desc="We hereby affirm that the information provided is accurate and that our organization supports the vision, objectives and principles of The Edo South Agenda 2027."
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-0.5 w-4 h-4 accent-[#f97316]"
                          checked={form.agreed}
                          onChange={e => set('agreed', e.target.checked)}
                        />
                        <span className="text-sm text-gray-700">I agree to the declaration.</span>
                      </label>
                    </StepCard>
                  )}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between gap-3 mt-6">
                  <button
                    type="button"
                    onClick={prev}
                    className={`px-5 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors
                      ${step === 0 ? 'invisible' : ''}`}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    disabled={(isLast && !form.agreed) || submitting}
                    className={`px-6 py-3 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-50
                      ${isLast
                        ? 'bg-[#015b2d] hover:bg-[#01381d]'
                        : 'bg-[#f97316] hover:bg-orange-600'
                      }`}
                  >
                    {isLast ? (submitting ? 'Submitting...' : 'Submit') : 'Next'}
                  </button>
                </div>

              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:w-80 xl:w-96 w-full">
              <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-[0_12px_35px_rgba(1,56,29,0.08)]">
                <h4 className="font-heading text-3xl tracking-wide mb-5">Why Register</h4>
                <div className="space-y-5">
                  {WHY_ITEMS.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-[#f97316] flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <h6 className="font-bold text-sm text-gray-900 mb-1">{item.title}</h6>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

// ── StepCard wrapper ─────────────────────────────────────
function StepCard({
  title,
  desc,
  children,
}: {
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h5 className="font-bold text-base tracking-wide mb-2">{title}</h5>
      <p className="text-sm text-gray-500 mb-5">{desc}</p>
      {children}
    </div>
  )
}