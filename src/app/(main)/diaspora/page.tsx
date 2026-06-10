'use client'
import { useState } from 'react'
import { toast } from 'sonner'

const LGAS = ['Oredo', 'Ikpoba-Okha', 'Egor', 'Ovia North East', 'Ovia South West', 'Uhunmwonde', 'Orhionmwon']
const INDUSTRIES = ['Healthcare', 'Education', 'Agriculture', 'Technology', 'Finance', 'Manufacturing', 'Construction', 'Public Service', 'Business', 'Other']
const PROJECTS = ['Borehole', 'Road Construction', 'Solar Street Lights', 'Health Centre', 'School Renovation', 'ICT Centre', 'Skills Acquisition Centre', 'Market Development', 'Agricultural Support', 'Other']
const CITIZENSHIP = ['Citizen', 'Permanent Resident', 'Work Permit', 'Student', 'Other']
const RATINGS = ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor']

const inputClass = 'w-full border-[1.5px] border-[#dfe5da] rounded-[14px] px-4 py-3.5 text-[0.95rem] bg-[#fbfcfa] focus:outline-none focus:border-[#015b2d] focus:ring-2 focus:ring-[#015b2d]/10 focus:bg-white transition-colors'
const labelClass = 'block text-[0.82rem] font-bold uppercase tracking-[0.06em] text-[#667065] mb-2'

function SectionHead({ num, title, note }: { num: number; title: string; note: string }) {
  return (
    <div className="flex items-center gap-3.5 mb-5">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#015b2d] to-[#12442a] text-white flex items-center justify-center font-bold font-heading text-lg shadow-[0_10px_24px_rgba(1,56,29,0.18)] shrink-0">
        {num}
      </div>
      <div>
        <h2 className="text-[1.15rem] font-extrabold text-[#015b2d] leading-tight">{title}</h2>
        <p className="text-[#667065] text-[0.9rem] mt-1">{note}</p>
      </div>
    </div>
  )
}

function OptionItem({ name, value, type = 'radio', checked, onChange, label }: any) {
  return (
    <label className="flex items-center gap-2.5 px-3.5 py-3 bg-[#fbfcfa] border-[1.5px] border-[#dfe5da] rounded-[14px] cursor-pointer hover:border-[#015b2d]/30 hover:bg-[#eef3ea] transition-all min-h-[54px]">
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} className="accent-[#015b2d]" />
      <span className="text-[0.92rem] font-semibold text-[#172018]">{label}</span>
    </label>
  )
}

export default function DiasporaPage() {
  const [form, setForm] = useState({
    full_name: '', gender: '', date_of_birth: '', phone: '', whatsapp_number: '', email: '',
    country: '', state_province: '', city: '', citizenship_status: '',
    lga_origin: '', ward: '', community: '',
    occupation: '', organization: '', industry: '',
    would_invest: '', investment_dream: '',
    first_action: '', priority_project: '', one_project: '',
    feels_represented: '', senator_expectations: '', bill_policy: '', development_rating: '',
    five_minutes: '',
    advisory_council: '',
    message_to_mai: '',
    pledge: false,
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.pledge) {
      toast.error('Please accept the MAI Diaspora Network Pledge before submitting.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/diaspora', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setSubmitted(true)
      toast.success('Registration submitted successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f7f8f3] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-12 text-center max-w-md w-full shadow-sm border border-[#dfe5da]">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-heading text-3xl text-[#01381d] mb-3">REGISTRATION <span className="text-[#f97316]">RECEIVED!</span></h2>
          <p className="text-[#667065] text-sm leading-relaxed mb-6">
            Thank you for joining the MAI Diaspora Network. We will be in touch shortly.
          </p>
          <p className="text-[#f97316] font-black text-sm tracking-widest uppercase">The Time Is MAI</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#01381d] to-[#015b2d] text-white py-20 overflow-hidden">
        <div className="absolute w-[280px] h-[280px] -right-20 -top-10 rounded-full bg-[#f97316] opacity-[0.08]" />
        <div className="absolute w-[220px] h-[220px] -left-12 -bottom-20 rounded-full bg-white opacity-[0.05]" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <p className="text-[#f97316] font-bold text-[0.8rem] uppercase tracking-[3px] mb-3">MAI Diaspora Network</p>
          <h1 className="font-heading text-[clamp(2.8rem,8vw,5.2rem)] leading-[0.95]">DIASPORA REGISTRATION FORM</h1>
          <p className="max-w-3xl mx-auto mt-4 opacity-90 text-base leading-[1.75]">
            Join the MAI Diaspora Network and share your ideas, expertise, and commitment to the development of Edo South.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 -mt-10 mb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white border border-[#015b2d]/[0.08] rounded-[28px] shadow-[0_16px_40px_rgba(1,56,29,0.10)] overflow-hidden">
            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-10">

                {/* 1. Personal Information */}
                <div>
                  <SectionHead num={1} title="Personal Information" note="Tell us who you are." />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Full Name <span className="text-[#f97316]">*</span></label><input type="text" name="full_name" value={form.full_name} onChange={handleChange} required placeholder="Enter your full name" className={inputClass} /></div>
                    <div><label className={labelClass}>Gender <span className="text-[#f97316]">*</span></label>
                      <select name="gender" value={form.gender} onChange={handleChange} required className={inputClass}>
                        <option value="">Select gender</option>
                        <option>Male</option><option>Female</option>
                      </select>
                    </div>
                    <div><label className={labelClass}>Date of Birth <span className="text-[#f97316]">*</span></label><input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} required className={inputClass} /></div>
                    <div><label className={labelClass}>Phone Number <span className="text-[#f97316]">*</span></label><input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="e.g. +1 234 567 890" className={inputClass} /></div>
                    <div><label className={labelClass}>WhatsApp Number</label><input type="tel" name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder="If different from phone" className={inputClass} /></div>
                    <div><label className={labelClass}>Email Address <span className="text-[#f97316]">*</span></label><input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="example@email.com" className={inputClass} /></div>
                  </div>
                </div>

                {/* 2. Diaspora Information */}
                <div>
                  <SectionHead num={2} title="Diaspora Information" note="Where you live and your legal status." />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><label className={labelClass}>Country of Residence <span className="text-[#f97316]">*</span></label><input type="text" name="country" value={form.country} onChange={handleChange} required placeholder="Country of residence" className={inputClass} /></div>
                    <div><label className={labelClass}>State / Province</label><input type="text" name="state_province" value={form.state_province} onChange={handleChange} placeholder="State / Province" className={inputClass} /></div>
                    <div><label className={labelClass}>City <span className="text-[#f97316]">*</span></label><input type="text" name="city" value={form.city} onChange={handleChange} required placeholder="City" className={inputClass} /></div>
                  </div>
                  <div>
                    <label className={labelClass}>Citizenship Status <span className="text-[#f97316]">*</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {CITIZENSHIP.map(c => <OptionItem key={c} name="citizenship_status" value={c} checked={form.citizenship_status === c} onChange={handleChange} label={c} />)}
                    </div>
                  </div>
                </div>

                {/* 3. Edo South Connection */}
                <div>
                  <SectionHead num={3} title="Edo South Connection" note="Tell us your origin in Edo South." />
                  <div className="mb-4">
                    <label className={labelClass}>LGA of Origin <span className="text-[#f97316]">*</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {LGAS.map(l => <OptionItem key={l} name="lga_origin" value={l} checked={form.lga_origin === l} onChange={handleChange} label={l} />)}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Ward <span className="text-[#f97316]">*</span></label><input type="text" name="ward" value={form.ward} onChange={handleChange} required placeholder="Ward" className={inputClass} /></div>
                    <div><label className={labelClass}>Community <span className="text-[#f97316]">*</span></label><input type="text" name="community" value={form.community} onChange={handleChange} required placeholder="Community" className={inputClass} /></div>
                  </div>
                </div>

                {/* 4. Professional Information */}
                <div>
                  <SectionHead num={4} title="Professional Information" note="Your work and industry background." />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><label className={labelClass}>Occupation <span className="text-[#f97316]">*</span></label><input type="text" name="occupation" value={form.occupation} onChange={handleChange} required placeholder="Occupation" className={inputClass} /></div>
                    <div><label className={labelClass}>Organization</label><input type="text" name="organization" value={form.organization} onChange={handleChange} placeholder="Organization" className={inputClass} /></div>
                  </div>
                  <div>
                    <label className={labelClass}>Industry <span className="text-[#f97316]">*</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {INDUSTRIES.map(i => <OptionItem key={i} name="industry" value={i} checked={form.industry === i} onChange={handleChange} label={i} />)}
                    </div>
                  </div>
                </div>

                {/* 5. Investment Interest */}
                <div>
                  <SectionHead num={5} title="Investment Interest" note="Let us know your interest in supporting Edo South." />
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Would you consider investing in Edo South? <span className="text-[#f97316]">*</span></label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {['Yes', 'No', 'Maybe'].map(v => <OptionItem key={v} name="would_invest" value={v} checked={form.would_invest === v} onChange={handleChange} label={v} />)}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>If Yes, what is your dream for Edo South?</label>
                      <textarea name="investment_dream" value={form.investment_dream} onChange={handleChange} rows={4} placeholder="Share your investment dream for Edo South" className={`${inputClass} resize-y`} />
                    </div>
                  </div>
                </div>

                {/* 6. Development Priorities */}
                <div>
                  <SectionHead num={6} title="Development Priorities" note="Tell MAI what should come first." />
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>If elected, what is the first thing you would want Senator MAI to do?</label>
                      <textarea name="first_action" value={form.first_action} onChange={handleChange} rows={4} className={`${inputClass} resize-y`} />
                    </div>
                    <div>
                      <label className={labelClass}>What constituency project would have the greatest impact?</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {PROJECTS.map(p => <OptionItem key={p} name="priority_project" value={p} checked={form.priority_project === p} onChange={handleChange} label={p} />)}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>If you could choose only one project for your community, what would it be?</label>
                      <textarea name="one_project" value={form.one_project} onChange={handleChange} rows={4} className={`${inputClass} resize-y`} />
                    </div>
                  </div>
                </div>

                {/* 7. Representation */}
                <div>
                  <SectionHead num={7} title="Representation and Governance" note="Share your view on representation and policy." />
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Do you feel adequately represented at the National Assembly? <span className="text-[#f97316]">*</span></label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {['Yes', 'No'].map(v => <OptionItem key={v} name="feels_represented" value={v} checked={form.feels_represented === v} onChange={handleChange} label={v} />)}
                      </div>
                    </div>
                    <div><label className={labelClass}>What do you expect from a Senator representing Edo South?</label><textarea name="senator_expectations" value={form.senator_expectations} onChange={handleChange} rows={4} className={`${inputClass} resize-y`} /></div>
                    <div><label className={labelClass}>What bill or policy would you like MAI to champion?</label><textarea name="bill_policy" value={form.bill_policy} onChange={handleChange} rows={4} className={`${inputClass} resize-y`} /></div>
                    <div>
                      <label className={labelClass}>How would you rate development in your community? <span className="text-[#f97316]">*</span></label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {RATINGS.map(r => <OptionItem key={r} name="development_rating" value={r} checked={form.development_rating === r} onChange={handleChange} label={r} />)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. Final Question */}
                <div>
                  <SectionHead num={8} title="Final Question" note="Your direct message to MAI." />
                  <div><label className={labelClass}>If you had 5 minutes with Senator MAI, what would you ask him to do?</label><textarea name="five_minutes" value={form.five_minutes} onChange={handleChange} rows={4} className={`${inputClass} resize-y`} /></div>
                </div>

                {/* 9. Advisory Council */}
                <div>
                  <SectionHead num={9} title="Advisory Council" note="Offer your time and experience." />
                  <div>
                    <label className={labelClass}>Would you serve on a Diaspora Advisory Council? <span className="text-[#f97316]">*</span></label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {['Yes', 'No'].map(v => <OptionItem key={v} name="advisory_council" value={v} checked={form.advisory_council === v} onChange={handleChange} label={v} />)}
                    </div>
                  </div>
                </div>

                {/* 10. Message to MAI */}
                <div>
                  <SectionHead num={10} title="Message to MAI" note="Tell us what you would like to see in Edo South." />
                  <div><label className={labelClass}>What development project would you like to see in Edo South?</label><textarea name="message_to_mai" value={form.message_to_mai} onChange={handleChange} rows={4} className={`${inputClass} resize-y`} /></div>
                </div>

                {/* 11. Pledge */}
                <div>
                  <SectionHead num={11} title="MAI Diaspora Network Pledge" note="Please accept the pledge to complete registration." />
                  <div className="bg-[#eef3ea] border-[1.5px] border-[#015b2d]/[0.12] rounded-[18px] p-5">
                    <p className="text-[#667065] leading-[1.8] mb-4 text-sm">
                      "I proudly join the MAI Diaspora Network and pledge to support the vision of <strong>Hon. Mathew Aigbuhenze Iduoriyekemwen</strong> for a more prosperous, inclusive, and developed Edo South. I commit to contributing my ideas, expertise, experience, influence, and resources, where possible, towards the advancement of our people and communities."
                    </p>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" name="pledge" checked={form.pledge} onChange={handleChange} className="w-4 h-4 accent-[#015b2d] mt-0.5 shrink-0" />
                      <span className="text-sm text-[#667065] leading-relaxed">I Accept This Pledge and Join the MAI Diaspora Network</span>
                    </label>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full border-none rounded-[14px] py-4 bg-gradient-to-br from-[#f97316] to-[#fb8c3a] text-white font-extrabold tracking-[0.04em] transition-all shadow-[0_12px_28px_rgba(249,115,22,0.28)] hover:bg-[#015b2d] hover:-translate-y-0.5 disabled:opacity-60">
                  {loading ? 'SUBMITTING...' : 'SUBMIT REGISTRATION'}
                </button>

              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}