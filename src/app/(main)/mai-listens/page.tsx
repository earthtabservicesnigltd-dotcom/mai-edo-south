'use client'
import { useState } from 'react'
import { toast } from 'sonner'

const CATEGORIES = ['Road', 'Electricity', 'Water', 'Healthcare', 'Education', 'Youth Empowerment', 'Women Empowerment', 'Security', 'Market Support', 'Employment', 'Agriculture', 'Flooding', 'Skills Training', 'Other']

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

export default function MAIListensPage() {
  const [form, setForm] = useState({
    full_name: '', phone: '', whatsapp_number: '', email: '',
    gender: '', age_range: '',
    lga: '', ward: '', community: '', street: '', polling_unit: '',
    issue: '', duration: '', affected: '',
    priority: 'Very urgent',
    solution: '',
    consent: false,
  })
  const [categories, setCategories] = useState<string[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function toggleCategory(cat: string) {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.consent) { toast.error('Please confirm your consent before submitting.'); return }
    if (categories.length === 0) { toast.error('Please select at least one category.'); return }
    setLoading(true)
    try {
      let imageData = null
      if (file) {
        imageData = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      }

      const res = await fetch('/api/mai-listens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, categories, image_data: imageData }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setSubmitted(true)
      toast.success('Feedback submitted successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f7f8f3] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-12 text-center max-w-md w-full shadow-sm border border-[#dfe5da]">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="font-heading text-3xl text-[#01381d] mb-3">FEEDBACK <span className="text-[#f97316]">RECEIVED!</span></h2>
          <p className="text-[#667065] text-sm leading-relaxed mb-6">Thank you for sharing your community's needs with MAI. Your feedback will help shape the development agenda for Edo South.</p>
          <p className="text-[#f97316] font-black text-sm tracking-widest uppercase">The Time Is MAI</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="relative bg-gradient-to-br from-[#01381d] to-[#015b2d] text-white py-20 overflow-hidden">
        <div className="absolute w-[280px] h-[280px] -right-20 -top-10 rounded-full bg-[#f97316] opacity-[0.08]" />
        <div className="absolute w-[220px] h-[220px] -left-12 -bottom-20 rounded-full bg-white opacity-[0.05]" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <p className="text-[#f97316] font-bold text-[0.8rem] uppercase tracking-[3px] mb-3">MAI Listens</p>
          <h1 className="font-heading text-[clamp(3rem,8vw,5.2rem)] leading-[0.95]">COMMUNITY <span className="text-[#f97316]">FEEDBACK FORM</span></h1>
          <p className="max-w-3xl mx-auto mt-4 opacity-90 text-base leading-[1.75]">Tell MAI what your community needs. Your feedback helps Hon. Mathew Aigbuhenze Iduoriyekemwen identify key areas to advocate for Edo South development.</p>
        </div>
      </section>

      <section className="py-20 -mt-10 mb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white border border-[#015b2d]/[0.08] rounded-[28px] shadow-[0_16px_40px_rgba(1,56,29,0.10)] overflow-hidden">
            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div>
                  <SectionHead num={1} title="Personal Information" note="Please provide your contact details." />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Full Name <span className="text-[#f97316]">*</span></label><input type="text" name="full_name" value={form.full_name} onChange={handleChange} required placeholder="Enter your full name" className={inputClass} /></div>
                    <div><label className={labelClass}>Phone Number <span className="text-[#f97316]">*</span></label><input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="e.g. 08012345678" className={inputClass} /></div>
                    <div><label className={labelClass}>WhatsApp Number</label><input type="tel" name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder="If different from phone" className={inputClass} /></div>
                    <div><label className={labelClass}>Email Address</label><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="example@email.com" className={inputClass} /></div>
                    <div><label className={labelClass}>Gender <span className="text-[#f97316]">*</span></label><select name="gender" value={form.gender} onChange={handleChange} required className={inputClass}><option value="">Select gender</option><option>Male</option><option>Female</option><option>Prefer not to say</option></select></div>
                    <div><label className={labelClass}>Age Range <span className="text-[#f97316]">*</span></label><select name="age_range" value={form.age_range} onChange={handleChange} required className={inputClass}><option value="">Select age range</option><option>18–25</option><option>26–35</option><option>36–50</option><option>50+</option></select></div>
                  </div>
                </div>

                <div>
                  <SectionHead num={2} title="Community Information" note="Help us identify your location." />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className={labelClass}>LGA <span className="text-[#f97316]">*</span></label><input type="text" name="lga" value={form.lga} onChange={handleChange} required placeholder="Local Government Area" className={inputClass} /></div>
                    <div><label className={labelClass}>Ward <span className="text-[#f97316]">*</span></label><input type="text" name="ward" value={form.ward} onChange={handleChange} required placeholder="Ward" className={inputClass} /></div>
                    <div><label className={labelClass}>Community <span className="text-[#f97316]">*</span></label><input type="text" name="community" value={form.community} onChange={handleChange} required placeholder="Community / Town / Village" className={inputClass} /></div>
                    <div><label className={labelClass}>Street / Area</label><input type="text" name="street" value={form.street} onChange={handleChange} placeholder="Street / Area" className={inputClass} /></div>
                    <div><label className={labelClass}>Polling Unit</label><input type="text" name="polling_unit" value={form.polling_unit} onChange={handleChange} placeholder="Polling Unit" className={inputClass} /></div>
                  </div>
                </div>

                <div>
                  <SectionHead num={3} title="Nature of Request / Complaint" note="Select all that apply." />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {CATEGORIES.map(cat => (
                      <label key={cat} className="flex items-center gap-2.5 px-3.5 py-3 bg-[#fbfcfa] border-[1.5px] border-[#dfe5da] rounded-[14px] cursor-pointer hover:border-[#015b2d]/30 hover:bg-[#eef3ea] transition-all min-h-[54px]">
                        <input type="checkbox" checked={categories.includes(cat)} onChange={() => toggleCategory(cat)} className="accent-[#015b2d]" />
                        <span className="text-[0.92rem] font-semibold text-[#172018]">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHead num={4} title="Details of Complaint / Request" note="Describe the issue clearly." />
                  <div className="space-y-4">
                    <div><label className={labelClass}>What is the issue? <span className="text-[#f97316]">*</span></label><textarea name="issue" value={form.issue} onChange={handleChange} required rows={4} placeholder="What is the issue affecting your community?" className={`${inputClass} resize-y`} /></div>
                    <div><label className={labelClass}>How long has this existed?</label><textarea name="duration" value={form.duration} onChange={handleChange} rows={3} placeholder="How long has this issue existed?" className={`${inputClass} resize-y`} /></div>
                    <div className="md:w-1/2"><label className={labelClass}>People affected <span className="text-[#f97316]">*</span></label><select name="affected" value={form.affected} onChange={handleChange} required className={inputClass}><option value="">Select</option><option>Few persons</option><option>One street</option><option>One community</option><option>Multiple communities</option><option>Entire ward</option></select></div>
                  </div>
                </div>

                <div>
                  <SectionHead num={5} title="Evidence Upload" note="Upload photo showing the issue, if available." />
                  <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className={inputClass} />
                  {file && <p className="text-xs text-green-600 mt-1">✓ {file.name} selected</p>}
                </div>

                <div>
                  <SectionHead num={6} title="Priority Level" note="How urgent is this issue?" />
                  <div className="md:w-1/2"><label className={labelClass}>Priority</label><select name="priority" value={form.priority} onChange={handleChange} className={inputClass}><option>Very urgent</option><option>Urgent</option><option>Important but not urgent</option></select></div>
                </div>

                <div>
                  <SectionHead num={7} title="Suggested Solution" note="Share your proposed solution." />
                  <div><label className={labelClass}>What should be done?</label><textarea name="solution" value={form.solution} onChange={handleChange} rows={4} placeholder="What do you think should be done?" className={`${inputClass} resize-y`} /></div>
                </div>

                <div>
                  <SectionHead num={8} title="Consent" note="Please confirm before submitting." />
                  <div className="bg-[#eef3ea] border-[1.5px] border-[#015b2d]/[0.12] rounded-[18px] p-5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} className="w-4 h-4 accent-[#015b2d] mt-0.5 shrink-0" />
                      <span className="text-sm text-[#667065] leading-relaxed">I agree that this information may be used for community development, advocacy, and planning.</span>
                    </label>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full border-none rounded-[14px] py-4 bg-gradient-to-br from-[#f97316] to-[#fb8c3a] text-white font-extrabold tracking-[0.04em] transition-all shadow-[0_12px_28px_rgba(249,115,22,0.28)] hover:bg-[#015b2d] hover:-translate-y-0.5 disabled:opacity-60">
                  {loading ? 'SUBMITTING...' : 'SUBMIT FEEDBACK'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
