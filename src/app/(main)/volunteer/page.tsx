'use client'
import { supabaseBrowser } from '@/lib/supabase'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import VolunteerIDCard from '@/components/VolunteerIDCard'

const ROLES = [
  { icon: '📢', title: 'Campaign Mobilizers',       desc: 'Help organize rallies, door-to-door campaigns, and community outreach programs across Edo South.', badge: 'Field Work' },
  { icon: '🤝', title: 'Community Coordinators',    desc: 'Engage with local leaders, women groups, and youth to strengthen grassroots support.', badge: 'Community' },
  { icon: '📸', title: 'Media & Documentation',     desc: 'Take photos, record videos, and help manage social media content during events.', badge: 'Creative' },
  { icon: '📊', title: 'Data & Research Volunteers',desc: 'Collect feedback, conduct surveys, and support strategy planning.', badge: 'Research' },
  { icon: '🎤', title: 'Event Support Team',         desc: 'Assist in planning and executing town halls, summits, and major campaign events.', badge: 'Logistics' },
  { icon: '💻', title: 'Digital Volunteers',         desc: 'Help with online campaigns, content creation, and supporter engagement.', badge: 'Online' },
]

const BENEFITS = [
  { icon: '🌍', title: 'Make Real Impact',  desc: 'Directly contribute to positive change in your community.' },
  { icon: '🤝', title: 'Build Networks',    desc: 'Connect with leaders, professionals, and like-minded individuals.' },
  { icon: '📈', title: 'Gain Experience',   desc: 'Develop leadership, communication, and organizational skills.' },
]

const LGAS = [
  'Akoko-Edo','Egor','Esan Central','Esan North-East','Esan South-East','Esan West',
  'Etsako Central','Etsako East','Etsako West','Igueben','Ikpoba-Okha','Orhionmwon',
  'Oredo','Ovia North-East','Ovia South-West','Owan East','Owan West','Uhunmwonde',
]

const VOLUNTEER_AREAS = [
  'Grassroots Mobilization','Social Media Advocacy','Media & Publicity',
  'Event Planning','Community Engagement','Voter Education','Fundraising',
  'Security & Protocol','Logistics','Youth Mobilization','Women Mobilization',
  'ICT','Any Area Assigned',
]

const SKILLS = [
  'Graphic Design','Photography','Videography','Public Speaking',
  'Writing & Content Creation','ICT & Technology','Community Organizing',
  'Legal Services','Accounting & Finance','Project Management',
]

const inputClass = 'w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors bg-white'
const labelClass = 'block text-sm font-semibold mb-1.5 text-gray-700'

export default function VolunteerPage() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', gender: '', date_of_birth: '',
    phone: '', whatsapp_number: '', email: '',
    residential_address: '', lga: '', ward: '', polling_unit: '', community: '',
    motivation: '', physical_availability: '',
    previous_experience: false, experience_details: '',
    commitment: false,
    declaration: false,
  })
  const [volunteerAreas, setVolunteerAreas] = useState<string[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submittedVolunteer, setSubmittedVolunteer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function toggleArea(area: string) {
    setVolunteerAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area])
  }

  function toggleSkill(skill: string) {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.commitment) {
      toast.error('Please agree to the commitment declaration before submitting.')
      return
    }

     if (!form.declaration) {
      toast.error('Please agree to the declaration before submitting.')
      return
    }

    if (volunteerAreas.length === 0) {
      toast.error('Please select at least one area of service.')
      return
    }

    setLoading(true)

    try {
      let photoBase64 = ''
      if (photo) {
        const reader = new FileReader()
        photoBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(photo)
        })
      }

      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          volunteer_areas: volunteerAreas,
          skills,
          photoBase64,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')

      toast.success('Application Submitted! Welcome to the MAI movement.')
      setSubmittedVolunteer(data.volunteer)
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── SHOW ID CARD AFTER SUBMISSION ──
  if (submittedVolunteer) {
    return (
      <>
        <section className="bg-linear-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">Welcome To The Team</p>
            <h1 className="font-heading text-6xl md:text-7xl mb-4">YOU&apos;RE <span className="text-[#f97316]">IN!</span></h1>
            <p className="text-gray-200 text-lg max-w-xl mx-auto">Your volunteer ID card has been generated. Download it below.</p>
          </div>
        </section>
        <section className="bg-gray-50 py-12">
          <VolunteerIDCard volunteer={submittedVolunteer} />
        </section>
      </>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-linear-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">Be The Change</p>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">VOLUNTEER <span className="text-[#f97316]">WITH US</span></h1>
          <p className="text-gray-200 text-lg max-w-xl mx-auto">Join the movement. Be part of the team driving real transformation in Edo South.</p>
        </div>
      </section>

      {/* Roles */}
      <section className="hidden lg:block py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">How You Can Help</p>
            <h2 className="font-heading text-5xl md:text-6xl">VOLUNTEER <span className="text-[#f97316]">ROLES</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROLES.map((role, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl mb-4">{role.icon}</div>
                <h5 className="font-bold text-lg mb-2">{role.title}</h5>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{role.desc}</p>
                <span className="inline-block bg-[#f97316]/10 text-[#f97316] text-xs font-bold px-3 py-1 rounded-full">{role.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Join The Team</p>
            <h2 className="font-heading text-5xl md:text-6xl">BECOME A <span className="text-[#f97316]">VOLUNTEER</span></h2>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Personal Info */}
              <div>
                <p className="text-[#01381d] font-black text-sm uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">Personal Information</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>First Name <span className="text-[#f97316]">*</span></label>
                      <input type="text" name="first_name" value={form.first_name} onChange={handleChange} required placeholder="John" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name <span className="text-[#f97316]">*</span></label>
                      <input type="text" name="last_name" value={form.last_name} onChange={handleChange} required placeholder="Doe" className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Gender <span className="text-[#f97316]">*</span></label>
                      <select name="gender" value={form.gender} onChange={handleChange} required className={inputClass}>
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Date of Birth <span className="text-[#f97316]">*</span></label>
                      <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} required className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Phone Number <span className="text-[#f97316]">*</span></label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="+234 800 000 0000" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>WhatsApp Number</label>
                      <input type="tel" name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder="+234 800 000 0000" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Residential Address</label>
                    <input type="text" name="residential_address" value={form.residential_address} onChange={handleChange} placeholder="Your full address" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div>
                <p className="text-[#01381d] font-black text-sm uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">Location Information</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>LGA <span className="text-[#f97316]">*</span></label>
                      <select name="lga" value={form.lga} onChange={handleChange} required className={inputClass}>
                        <option value="">Select LGA...</option>
                        {LGAS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Ward <span className="text-[#f97316]">*</span></label>
                      <input type="text" name="ward" value={form.ward} onChange={handleChange} required placeholder="Your ward" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Polling Unit</label>
                      <input type="text" name="polling_unit" value={form.polling_unit} onChange={handleChange} placeholder="Optional" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Community/Town</label>
                      <input type="text" name="community" value={form.community} onChange={handleChange} placeholder="Your community" className={inputClass} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Volunteer Info */}
              <div>
                <p className="text-[#01381d] font-black text-sm uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">Volunteer Information</p>
                <div className="space-y-4">

                  <div>
                    <label className={labelClass}>Why do you want to volunteer?</label>
                    <textarea name="motivation" value={form.motivation} onChange={handleChange} rows={3} placeholder="Tell us why you want to join the movement..." className={`${inputClass} resize-none`} />
                  </div>

                  <div>
                    <label className={labelClass}>Area of Service <span className="text-[#f97316]">*</span></label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {VOLUNTEER_AREAS.map(area => (
                        <label key={area} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={volunteerAreas.includes(area)}
                            onChange={() => toggleArea(area)}
                            className="w-4 h-4 accent-[#f97316]"
                          />
                          <span className="text-sm text-gray-700">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Available for physical activities? <span className="text-[#f97316]">*</span></label>
                    <select name="physical_availability" value={form.physical_availability} onChange={handleChange} required className={inputClass}>
                      <option value="">Select...</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Occasionally">Occasionally</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Previous campaign experience?</label>
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="previous_experience" checked={form.previous_experience === true} onChange={() => setForm(f => ({ ...f, previous_experience: true }))} className="w-4 h-4 accent-[#f97316]" />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="previous_experience" checked={form.previous_experience === false} onChange={() => setForm(f => ({ ...f, previous_experience: false }))} className="w-4 h-4 accent-[#f97316]" />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                    {form.previous_experience && (
                      <textarea name="experience_details" value={form.experience_details} onChange={handleChange} rows={2} placeholder="Please describe your experience..." className={`${inputClass} resize-none mt-3`} />
                    )}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-[#01381d] font-black text-sm uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">Skills & Expertise</p>
                <div className="grid grid-cols-2 gap-2">
                  {SKILLS.map(skill => (
                    <label key={skill} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={skills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="w-4 h-4 accent-[#f97316]"
                      />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-3 pb-6 pt-6 border-b border-gray-100">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-36 h-36 rounded-full border-4 border-dashed border-[#f97316] flex items-center justify-center cursor-pointer hover:border-[#f97316] transition-colors overflow-hidden bg-gray-50"
                >
                  {photoPreview ? (
                    <Image src={photoPreview} alt="Preview" width={100} height={100} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center"><div className="text-2xl">📷</div><p className="text-md text-gray-400 mt-1">Upload Photo</p></div>
                  )}
                </div>
                <p className="text-sm text-gray-400">Passport photo • JPG, PNG or WebP • Max 2MB</p>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="hidden" />
              </div>

              {/* Commitment */}
              <div className="bg-[#01381d]/5 border border-[#01381d]/10 rounded-xl p-4">
                <p className="text-[#01381d] font-black text-sm uppercase tracking-widest mb-3">Commitment</p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="commitment"
                    checked={form.commitment}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#f97316] mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    I support the vision of <strong>Hon. Mathew Aigbuhenze Iduoriyekemwen</strong> and agree to volunteer peacefully and responsibly in support of the campaign.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="declaration"
                  checked={form.declaration}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#f97316] mt-0.5 shrink-0"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I hereby declare that the information provided is true and correct to the best of my knowledge.
                </span>
              </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f97316] text-white font-bold py-4 rounded-xl hover:bg-[#015b2d] transition-colors disabled:opacity-60 text-sm uppercase tracking-wider"
              >
                {loading ? 'Submitting...' : 'Submit Application & Get ID Card'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-5xl md:text-6xl">WHY VOLUNTEER <span className="text-[#f97316]">WITH MAI?</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {BENEFITS.map((b, i) => (
              <div key={i}>
                <div className="text-5xl mb-4">{b.icon}</div>
                <h5 className="font-bold text-lg mb-2">{b.title}</h5>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}