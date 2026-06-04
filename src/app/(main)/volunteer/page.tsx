'use client'
import { supabaseBrowser } from '@/lib/supabase'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

const ROLES = [
  {
    icon: '📢',
    title: 'Campaign Mobilizers',
    desc: 'Help organize rallies, door-to-door campaigns, and community outreach programs across Edo South.',
    badge: 'Field Work',
  },
  {
    icon: '🤝',
    title: 'Community Coordinators',
    desc: 'Engage with local leaders, women groups, and youth to strengthen grassroots support.',
    badge: 'Community',
  },
  {
    icon: '📸',
    title: 'Media & Documentation',
    desc: 'Take photos, record videos, and help manage social media content during events.',
    badge: 'Creative',
  },
  {
    icon: '📊',
    title: 'Data & Research Volunteers',
    desc: 'Collect feedback, conduct surveys, and support strategy planning.',
    badge: 'Research',
  },
  {
    icon: '🎤',
    title: 'Event Support Team',
    desc: 'Assist in planning and executing town halls, summits, and major campaign events.',
    badge: 'Logistics',
  },
  {
    icon: '💻',
    title: 'Digital Volunteers',
    desc: 'Help with online campaigns, content creation, and supporter engagement.',
    badge: 'Online',
  },
]

const BENEFITS = [
  { icon: '🌍', title: 'Make Real Impact', desc: 'Directly contribute to positive change in your community.' },
  { icon: '🤝', title: 'Build Networks', desc: 'Connect with leaders, professionals, and like-minded individuals.' },
  { icon: '📈', title: 'Gain Experience', desc: 'Develop leadership, communication, and organizational skills.' },
]
const AVAILABILITY = ['full-time', 'weekends', 'weekdays', 'evenings']


const AREAS_OF_INTEREST = [
  'mobilization',
  'media team',
  'ict team',
  'event coordination',
  'community outreach',
  'logistics',
]

const LGAS = [
  'Akoko-Edo',
  'Egor',
  'Esan Central',
  'Esan North-East',
  'Esan South-East',
  'Esan West',
  'Etsako Central',
  'Etsako East',
  'Etsako West',
  'Igueben',
  'Ikpoba-Okha',
  'Orhionmwon',
  'Oredo',
  'Ovia North-East',
  'Ovia South-West',
  'Owan East',
  'Owan West',
  'Uhunmwonde',
]

export default function VolunteerPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    location: '',
    lga: '',
    availability: '',
    area_of_interest: '',
    message: '',
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }
async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
        body: JSON.stringify({ ...form, photoBase64 }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')

      toast.success('Application Submitted!', {
        description: 'Thank you for joining the MAI movement. Our team will reach out to you shortly.',
      })
    } catch (err: any) {
      toast.error('Submission Failed', {
        description: err.message || 'Something went wrong. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      {/* Page Hero */}
      <section className="bg-linear-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">
            Be The Change
          </p>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">
            VOLUNTEER <span className="text-[#f97316]">WITH US</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-xl mx-auto">
            Join the movement. Be part of the team driving real transformation in Edo South.
          </p>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">
              How You Can Help
            </p>
            <h2 className="font-heading text-5xl md:text-6xl">
              VOLUNTEER <span className="text-[#f97316]">ROLES</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROLES.map((role, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="text-5xl mb-4">{role.icon}</div>
                <h5 className="font-bold text-lg mb-2">{role.title}</h5>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{role.desc}</p>
                <span className="inline-block bg-[#f97316]/10 text-[#f97316] text-xs font-bold px-3 py-1 rounded-full">
                  {role.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">
              Join The Team
            </p>
            <h2 className="font-heading text-5xl md:text-6xl">
              BECOME A <span className="text-[#f97316]">VOLUNTEER</span>
            </h2>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="font-bold text-2xl mb-2 text-[#01381d]">Application Submitted!</h3>
              <p className="text-gray-500 leading-relaxed">
                Thank you for joining the MAI movement. Our team will reach out to you shortly.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Photo Upload */}
                <div className="flex flex-col items-center gap-3 pb-4 border-b border-gray-100">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#f97316] transition-colors overflow-hidden bg-gray-50"
                  >
                    {photoPreview ? (
                      <Image src={photoPreview} alt="Preview" width={96} height={96} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <div className="text-2xl">📷</div>
                        <p className="text-xs text-gray-400 mt-1">Upload Photo</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">Passport photo • JPG, PNG or WebP • Max 2MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                      First Name <span className="text-[#f97316]">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      required
                      placeholder="Your first name"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                      First Name <span className="text-[#f97316]">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      required
                      placeholder="Your last name"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                      Phone Number <span className="text-[#f97316]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+234 800 000 0000"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    Email Address <span className="text-[#f97316]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors"
                  />
                </div>

               {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                      Location <span className="text-[#f97316]">*</span>
                    </label>
                    <input type="text" name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Benin City"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                      LGA <span className="text-[#f97316]">*</span>
                    </label>
                    <select name="lga" value={form.lga} onChange={handleChange} required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors bg-white">
                      <option value="">Select LGA...</option>
                      {LGAS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                {/* Availability & Area of Interest */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                      Availability <span className="text-[#f97316]">*</span>
                    </label>
                    <select name="availability" value={form.availability} onChange={handleChange} required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors bg-white">
                      <option value="">Select availability...</option>
                      {AVAILABILITY.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                      Area of Interest <span className="text-[#f97316]">*</span>
                    </label>
                    <select name="area_of_interest" value={form.area_of_interest} onChange={handleChange} required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors bg-white">
                      <option value="">Select area...</option>
                      {AREAS_OF_INTEREST.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    Why do you want to volunteer? (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us why you want to join the movement..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#f97316] text-white font-bold py-4 rounded-xl hover:bg-[#015b2d] transition-colors disabled:opacity-60 text-sm uppercase tracking-wider"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-5xl md:text-6xl">
              WHY VOLUNTEER <span className="text-[#f97316]">WITH MAI?</span>
            </h2>
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