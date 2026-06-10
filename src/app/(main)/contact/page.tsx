'use client'
import { useState } from 'react'

const CONTACT_INFO = [
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    ),
    label: 'Campaign Office',
    value: 'House 19 Anineh Avenue off GRA, Benin City',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
    ),
    label: 'Phone',
    value: '+234 800 000 0000',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    label: 'Email',
    value: 'info@mai4senate.com',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
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
        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">
            Get In Touch
          </p>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">
            CONTACT <span className="text-[#f97316]">US</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-xl">
            Have a question, suggestion or want to get involved?
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">

            {/* Form */}
            <div>
              <p className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-3">
                Send A Message
              </p>
              <h2 className="font-heading text-4xl md:text-5xl mb-8">
                REACH OUT TO <span className="text-[#f97316]">THE TEAM</span>
              </h2>

              {submitted ? (
                <div className="bg-[#015b2d]/5 border border-[#015b2d]/20 rounded-2xl p-10 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="font-bold text-xl mb-2 text-[#01381d]">Message Received!</h3>
                  <p className="text-gray-500">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
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
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
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
                      Subject <span className="text-[#f97316]">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this about?"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                      Message <span className="text-[#f97316]">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Write your message here..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#f97316] text-white font-bold py-4 rounded-xl hover:bg-[#015b2d] transition-colors disabled:opacity-60 uppercase tracking-wider"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact info */}
              <div className="bg-[#01381d] text-white rounded-2xl p-8">
                <h3 className="font-bold text-lg mb-6">Contact Information</h3>
                <div className="space-y-5">
                  {CONTACT_INFO.map((info, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#f97316] rounded-full flex items-center justify-center shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{info.label}</p>
                        <p className="font-semibold text-sm">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social media */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="font-bold text-lg mb-5">Follow the Campaign</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Facebook',  href: '#', color: 'bg-blue-600' },
                    { label: 'Twitter/X', href: '#', color: 'bg-black' },
                    { label: 'Instagram', href: '#', color: 'bg-pink-600' },
                    { label: 'YouTube',   href: '#', color: 'bg-red-600' },
                  ].map(s => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors group"
                    >
                      <div className={`w-8 h-8 ${s.color} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{s.label[0]}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-[#f97316] transition-colors">
                        {s.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Office hours */}
              <div className="bg-[#f97316]/10 border border-[#f97316]/20 rounded-2xl p-6">
                <h3 className="font-bold text-[#f97316] mb-3">Campaign Office Hours</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-semibold">8:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">9:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold text-gray-400">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}