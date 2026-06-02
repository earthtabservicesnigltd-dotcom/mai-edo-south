'use client'
import { useState } from 'react'

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

export default function VolunteerPage() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    role: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: wire to Supabase
    await new Promise(r => setTimeout(r, 1000))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <>
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                      Full Name <span className="text-[#f97316]">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
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

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    Preferred Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors bg-white"
                  >
                    <option value="">Select a role...</option>
                    {ROLES.map(r => (
                      <option key={r.title} value={r.title}>{r.title}</option>
                    ))}
                  </select>
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