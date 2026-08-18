'use client'
import { useState } from 'react'
import { toast } from 'sonner'

const LGAS = [
  'Akoko-Edo','Egor','Esan Central','Esan North-East','Esan South-East','Esan West',
  'Etsako Central','Etsako East','Etsako West','Igueben','Ikpoba-Okha','Orhionmwon',
  'Oredo','Ovia North-East','Ovia South-West','Owan East','Owan West','Uhunmwonde',
]
const CATEGORIES = ['Youth & Employment', 'Education', 'Healthcare', 'Infrastructure', 'Security', 'Economy & Business', 'Women Affairs', 'Agriculture', 'Environment', 'Diaspora Affairs', 'Politics & Governance', 'General Questions']

export default function AskMAIPage() {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', lga: '', community: '', category: '', title: '', question: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/ask-mai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed to submit')
      toast.success('Question Submitted!', { description: 'Your question has been received.' })
      setForm({ full_name: '', email: '', phone: '', lga: '', community: '', category: '', title: '', question: '' })
    } catch {
      toast.error('Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#015b2d] transition-colors"
  const labelCls = "block text-sm font-semibold mb-1.5 text-gray-700"
  const cardCls = "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
  const cardHeaderCls = "bg-[#01381d] text-white px-6 py-4"
  const cardBodyCls = "p-6 md:p-8"

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h6 className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">ASK. VOTE. FOLLOW UP.</h6>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">Ask <span className="text-[#f97316]">MAI</span></h1>
          <p className="text-gray-200 text-lg max-w-xl mx-auto">Have a question for MAI? Ask directly and get answers on issues affecting Edo South.</p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* SUBMIT QUESTION CARD */}
              <div className={cardCls}>
                <div className={cardHeaderCls}>
                  <h4 className="font-bold text-lg">Submit Your Question</h4>
                  <p className="text-sm text-gray-300">Ask a question by text or video.</p>
                </div>
                <div className={cardBodyCls}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className={labelCls}>Full Name</label><input type="text" name="full_name" value={form.full_name} onChange={handleChange} required className={inputCls} placeholder="Your name" /></div>
                      <div><label className={labelCls}>Email Address</label><input type="email" name="email" value={form.email} onChange={handleChange} required className={inputCls} placeholder="Email Address" /></div>
                      <div><label className={labelCls}>Phone Number (Optional)</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="Phone number" /></div>
                      <div><label className={labelCls}>LGA</label><select name="lga" value={form.lga} onChange={handleChange} required className={inputCls}><option value="">Select LGA...</option>{LGAS.map(l => <option key={l}>{l}</option>)}</select></div>
                      <div><label className={labelCls}>Community</label><input type="text" name="community" value={form.community} onChange={handleChange} className={inputCls} placeholder="Community" /></div>
                      <div><label className={labelCls}>Category</label><select name="category" value={form.category} onChange={handleChange} required className={inputCls}><option value="">Select...</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                    </div>
                    <div><label className={labelCls}>Question Title</label><input type="text" name="title" value={form.title} onChange={handleChange} required className={inputCls} placeholder="Type your Question Title here..." /></div>
                    <div><label className={labelCls}>Question</label><textarea name="question" value={form.question} onChange={handleChange} required rows={5} className={`${inputCls} resize-none`} placeholder="Type your question here..."></textarea></div>
                    
                    {/* Video Recorder UI Placeholder */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Record a Video Question (Optional)</p>
                      <button type="button" className="px-4 py-2 bg-[#015b2d] text-white text-xs font-bold rounded-xl hover:bg-[#01381d] transition-colors">Start Recording</button>
                      <p className="text-xs text-gray-400 mt-2">Speak clearly and keep your face visible.</p>
                    </div>

                    <div><label className={labelCls}>Upload Attachment (Optional)</label><input type="file" className={`${inputCls} file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#015b2d] file:text-white hover:file:bg-[#01381d]`} /></div>
                    
                    <button type="submit" disabled={loading} className="w-full bg-[#f97316] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#01381d] transition-colors disabled:opacity-60">
                      {loading ? 'Submitting...' : 'Submit Question'}
                    </button>
                  </form>
                </div>
              </div>

              {/* PUBLIC QUESTIONS CARD */}
              <div className={cardCls}>
                <div className={cardHeaderCls}>
                  <h4 className="font-bold text-lg">Public Questions</h4>
                  <p className="text-sm text-gray-300">Selected questions appear here after moderation.</p>
                </div>
                <div className="p-6 space-y-4">
                  
                  <div className="border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-2">Selected for Response</span>
                      <h5 className="font-bold text-base mb-1">What is your plan for reducing unemployment in Edo South?</h5>
                      <p className="text-xs text-gray-500 mb-3">Asked by: Osas, Oredo LGA</p>
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">Youth & Employment</span>
                      <div className="mt-4">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">MAI&apos;s Response</p>
                        <span className="inline-block bg-[#01381d] text-white text-xs font-bold px-3 py-1 rounded-full mr-2">Video Response</span>
                        <span className="inline-block bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">Text Response</span>
                      </div>
                    </div>
                    <div className="flex md:flex-col items-center justify-center bg-gray-50 rounded-xl p-4 min-w-[120px]">
                      <div className="font-heading text-2xl text-[#015b2d]">+1,250</div>
                      <div className="text-xs text-gray-500 mb-2 text-center">people want this answered</div>
                      <button className="px-3 py-1.5 border-2 border-[#015b2d] text-[#015b2d] text-xs font-bold rounded-full hover:bg-[#015b2d] hover:text-white transition-colors">Upvote</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-bold text-lg mb-3 text-[#015b2d]">Question Status</h4>
                <p className="text-sm text-gray-500 mb-4">Track where your submission is in the process.</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="p-3 bg-gray-50 rounded-xl">🟡 Received</div>
                  <div className="p-3 bg-gray-50 rounded-xl">🟠 Under Review</div>
                  <div className="p-3 bg-gray-50 rounded-xl">🔵 Selected for Response</div>
                  <div className="p-3 bg-gray-50 rounded-xl">🟢 Answered</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-bold text-lg mb-3 text-[#015b2d]">Suggested Questions</h4>
                <div className="flex flex-wrap gap-2">
                  {['What should MAI\'s first priority be as Senator?', 'How will you attract federal projects?', 'What is your plan for youths?', 'How will you support small businesses?', 'How can the diaspora contribute?'].map(q => (
                    <span key={q} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">{q}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VIDEO RESPONSE SECTION */}
      <section className="py-20 bg-[#01381d] text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 text-[#f97316] text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">Video response series</div>
            <h2 className="font-heading text-4xl md:text-5xl mb-4">Your questions, answered on camera</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Every week, MAI selects the top questions from citizens and records a direct video response uploaded everywhere so no one is left out.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 mb-12">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl">▶️</div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-[#f97316] font-bold text-xs uppercase tracking-wider mb-1">Now available</p>
              <h3 className="font-heading text-2xl mb-1">Ask MAI Episode 1</h3>
              <p className="text-gray-400 text-sm">A 5–10 minute video answering the top questions submitted this week.</p>
            </div>
            <a href="#" className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-bold hover:bg-white hover:text-[#01381d] transition-colors whitespace-nowrap">Watch now →</a>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Top questions this week</p>
              <div className="space-y-3">
                {['What is your plan for public school funding?', 'How will healthcare reach underserved communities?', 'What support exists for young entrepreneurs?', 'What is the road infrastructure timeline?'].map((q, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[#f97316] font-bold text-sm">Q{i + 1}</span>
                    <span className="text-sm text-gray-200">{q}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">How it works</p>
              <div className="space-y-4">
                <div className="flex gap-3"><div className="w-2 h-2 rounded-full bg-[#f97316] mt-2 shrink-0"></div><div className="text-sm text-gray-200">Citizens submit questions each week</div></div>
                <div className="flex gap-3"><div className="w-2 h-2 rounded-full bg-[#f97316] mt-2 shrink-0"></div><div className="text-sm text-gray-200">MAI records a focused video response</div></div>
                <div className="flex gap-3"><div className="w-2 h-2 rounded-full bg-[#f97316] mt-2 shrink-0"></div><div className="text-sm text-gray-200">Published across all platforms</div></div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#f97316]/20 text-[#f97316] flex items-center justify-center text-xl">🔍</div>
              <div>
                <h4 className="font-bold text-lg">Search past answers</h4>
                <p className="text-sm text-gray-400">Check if MAI has already addressed your topic.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" placeholder="Education, Healthcare, Youth, Roads…" className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-gray-400 px-5 py-3 rounded-xl focus:outline-none focus:border-[#f97316]" />
              <button className="bg-[#f97316] text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors">Search</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {['Education', 'Healthcare', 'Youth', 'Roads', 'Economy', 'Security'].map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-white/10 text-gray-300 text-xs font-semibold rounded-full cursor-pointer hover:bg-[#f97316] hover:text-white transition-colors">{tag}</span>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}