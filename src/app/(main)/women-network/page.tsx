'use client'
import { useState } from 'react'
import { toast } from 'sonner'

const LGAS = ['Egor', 'Ikpoba-Okha', 'Oredo', 'Orhionmwon', 'Ovia North-East', 'Ovia South-West', 'Uhunmwonde']
const BIZ_CATEGORIES = ['Fashion', 'Catering', 'Retail', 'Agriculture', 'Beauty', 'Technology', 'Consulting', 'Education', 'Manufacturing', 'Other']
const IMPACT_CATEGORIES = ['Education', 'Business', 'Healthcare', 'Community Service', 'Youth Development']

export default function WomenNetworkPage() {
  // 1. Registration Form State
  const [regForm, setRegForm] = useState({
    full_name: '', date_of_birth: '', phone: '', whatsapp_number: '', email: '',
    lga: '', ward: '', community: '', occupation: ''
  })
  const [regLoading, setRegLoading] = useState(false)
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([])

  // 2. Voice Form State
  const [voiceForm, setVoiceForm] = useState({
    email: '', category: '', title: '', description: '', lga: '', community: ''
  })
  const [voiceLoading, setVoiceLoading] = useState(false)

  // 3. Business Form State
  const [bizForm, setBizForm] = useState({
    email: '', business_name: '', owner_name: '', category: '', lga: '', phone: '', social_links: '', description: ''
  })
  const [bizLoading, setBizLoading] = useState(false)

  // 4. Leader Form State
  const [leaderForm, setLeaderForm] = useState({
    email: '', full_name: '', position_held: '', organization: '', years_of_experience: '', community_impact: ''
  })
  const [leaderLoading, setLeaderLoading] = useState(false)

  // 5. Nomination Form State
  const [nomForm, setNomForm] = useState({
    email: '', nominee_name: '', category: 'Education', achievements: ''
  })
  const [nomLoading, setNomLoading] = useState(false)

  // Handlers
  const handleRegChange = (e: any) => setRegForm({ ...regForm, [e.target.name]: e.target.value })
  const handleVoiceChange = (e: any) => setVoiceForm({ ...voiceForm, [e.target.name]: e.target.value })
  const handleBizChange = (e: any) => setBizForm({ ...bizForm, [e.target.name]: e.target.value })
  const handleLeaderChange = (e: any) => setLeaderForm({ ...leaderForm, [e.target.name]: e.target.value })
  const handleNomChange = (e: any) => setNomForm({ ...nomForm, [e.target.name]: e.target.value })

  const toggleArea = (area: string) => {
    setAreasOfInterest(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area])
  }

  // Submit Functions
  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault(); setRegLoading(true)
    try {
      const res = await fetch('/api/women-network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...regForm, areas_of_interest: areasOfInterest })
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Registration Successful!', { description: 'Welcome to the MAI Women Network.' })
      setRegForm({ full_name: '', date_of_birth: '', phone: '', whatsapp_number: '', email: '', lga: '', ward: '', community: '', occupation: '' })
      setAreasOfInterest([])
    } catch { toast.error('Submission failed') } finally { setRegLoading(false) }
  }

  const submitVoice = async (e: React.FormEvent) => {
    e.preventDefault(); setVoiceLoading(true)
    try {
      const res = await fetch('/api/women-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voiceForm)
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Issue Submitted!')
      setVoiceForm({ email: '', category: '', title: '', description: '', lga: '', community: '' })
    } catch { toast.error('Submission failed') } finally { setVoiceLoading(false) }
  }

  const submitBusiness = async (e: React.FormEvent) => {
    e.preventDefault(); setBizLoading(true)
    try {
      const res = await fetch('/api/women-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bizForm)
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Business Listed!')
      setBizForm({ email: '', business_name: '', owner_name: '', category: '', lga: '', phone: '', social_links: '', description: '' })
    } catch { toast.error('Submission failed') } finally { setBizLoading(false) }
  }

  const submitLeader = async (e: React.FormEvent) => {
    e.preventDefault(); setLeaderLoading(true)
    try {
      const res = await fetch('/api/women-leaders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...leaderForm, years_of_experience: Number(leaderForm.years_of_experience) })
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Application Submitted!')
      setLeaderForm({ email: '', full_name: '', position_held: '', organization: '', years_of_experience: '', community_impact: '' })
    } catch { toast.error('Submission failed') } finally { setLeaderLoading(false) }
  }

  const submitNomination = async (e: React.FormEvent) => {
    e.preventDefault(); setNomLoading(true)
    try {
      const res = await fetch('/api/women-nominations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nomForm)
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Nomination Submitted!')
      setNomForm({ email: '', nominee_name: '', category: 'Education', achievements: '' })
    } catch { toast.error('Submission failed') } finally { setNomLoading(false) }
  }

  // Styling Constants
  const inputCls = "w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#015b2d] transition-colors"
  const labelCls = "block text-sm font-semibold mb-1.5 text-gray-700"
  const sectionTitleCls = "font-heading text-4xl md:text-5xl mb-2"
  const cardCls = "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
  const cardHeaderCls = "bg-[#01381d] text-white px-6 py-4"
  const cardBodyCls = "p-6 md:p-8"

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="font-heading text-6xl md:text-7xl mb-4">MAI Women <span className="text-[#f97316]">Network</span></h1>
          <p className="text-gray-200 text-lg max-w-xl mx-auto">A platform dedicated to empowering, connecting, and amplifying the voices of women across Edo South.</p>
        </div>
      </section>

      {/* 1. JOIN THE NETWORK */}
      <section id="join-network" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Section 1</div>
            <h2 className={sectionTitleCls}>Join the <span className="text-[#015b2d]">Network</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Become a registered member of the MAI Women Network.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={cardCls}>
                <div className={cardHeaderCls}><h4 className="font-bold text-lg">Registration Form</h4><p className="text-sm text-gray-300">Sign up to join the network.</p></div>
                <div className={cardBodyCls}>
                  <form onSubmit={submitRegistration} className="space-y-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Personal Information</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div><label className={labelCls}>Full Name</label><input type="text" name="full_name" value={regForm.full_name} onChange={handleRegChange} required className={inputCls} placeholder="Your full name" /></div>
                        <div><label className={labelCls}>Phone Number</label><input type="tel" name="phone" value={regForm.phone} onChange={handleRegChange} required className={inputCls} placeholder="Phone number" /></div>
                        <div><label className={labelCls}>WhatsApp Number</label><input type="tel" name="whatsapp_number" value={regForm.whatsapp_number} onChange={handleRegChange} className={inputCls} placeholder="WhatsApp number" /></div>
                        <div><label className={labelCls}>Email Address</label><input type="email" name="email" value={regForm.email} onChange={handleRegChange} required className={inputCls} placeholder="Email address" /></div>
                        <div><label className={labelCls}>Date of Birth</label><input type="date" name="date_of_birth" value={regForm.date_of_birth} onChange={handleRegChange} className={inputCls} /></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Location</p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div><label className={labelCls}>LGA</label><select name="lga" value={regForm.lga} onChange={handleRegChange} required className={inputCls}><option value="">Select LGA...</option>{LGAS.map(l => <option key={l}>{l}</option>)}</select></div>
                        <div><label className={labelCls}>Ward</label><input type="text" name="ward" value={regForm.ward} onChange={handleRegChange} className={inputCls} placeholder="Ward" /></div>
                        <div><label className={labelCls}>Community</label><input type="text" name="community" value={regForm.community} onChange={handleRegChange} className={inputCls} placeholder="Community" /></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Occupation</p>
                      <select name="occupation" value={regForm.occupation} onChange={handleRegChange} className={inputCls}>
                        <option value="">Select...</option>
                        {['Trader', 'Entrepreneur', 'Civil Servant', 'Professional', 'Farmer', 'Artisan', 'Student', 'Other'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Areas of Interest</p>
                      <div className="flex flex-wrap gap-2">
                        {['Leadership', 'Entrepreneurship', 'Skills Acquisition', 'Politics', 'Community Development', 'Agriculture', 'Education', 'Healthcare', 'Mentorship'].map(area => (
                          <button type="button" key={area} onClick={() => toggleArea(area)} className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${areasOfInterest.includes(area) ? 'bg-[#015b2d] text-white border-[#015b2d]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#015b2d]'}`}>{area}</button>
                        ))}
                      </div>
                    </div>
                    <button type="submit" disabled={regLoading} className="w-full bg-[#f97316] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#01381d] transition-colors disabled:opacity-60">{regLoading ? 'Submitting...' : 'Register & Join'}</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-bold text-lg mb-3 text-[#f97316]">After Registration</h4>
                <p className="text-sm text-gray-500 mb-3">Once you register, we automatically generate:</p>
                <div className="space-y-2 text-sm text-gray-600"><div className="p-3 bg-gray-50 rounded-xl">Membership ID</div><div className="p-3 bg-gray-50 rounded-xl">Digital Membership Card</div><div className="p-3 bg-gray-50 rounded-xl">Welcome Email</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WOMEN'S VOICE */}
      <section id="womens-voice" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Section 2</div>
            <h2 className={sectionTitleCls}>Women's <span className="text-[#015b2d]">Voice</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Share the issues affecting you and your community. Every submission helps shape MAI's priorities for women.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={cardCls}>
                <div className={cardHeaderCls}><h4 className="font-bold text-lg">Submit Your Issue</h4><p className="text-sm text-gray-300">Tell us what matters most to you.</p></div>
                <div className={cardBodyCls}>
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Category</p>
                    <div className="flex flex-wrap gap-2">
                      {['Economic Challenges', 'Healthcare', 'Maternal Health', 'Education', 'Security', 'Domestic Violence Support', 'Skills & Empowerment', 'Market Challenges'].map(cat => (
                        <button type="button" key={cat} onClick={() => setVoiceForm({...voiceForm, category: cat})} className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${voiceForm.category === cat ? 'bg-[#015b2d] text-white border-[#015b2d]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#015b2d]'}`}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <form onSubmit={submitVoice} className="space-y-4">
                    <div><label className={labelCls}>Your Email</label><input type="email" name="email" value={voiceForm.email} onChange={handleVoiceChange} required className={inputCls} placeholder="Your email address" /></div>
                    <div><label className={labelCls}>Title</label><input type="text" name="title" value={voiceForm.title} onChange={handleVoiceChange} required className={inputCls} placeholder="Give your submission a short title" /></div>
                    <div><label className={labelCls}>Description</label><textarea name="description" value={voiceForm.description} onChange={handleVoiceChange} required rows={5} className={`${inputCls} resize-none`} placeholder="Describe the issue in detail..."></textarea></div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className={labelCls}>LGA</label><select name="lga" value={voiceForm.lga} onChange={handleVoiceChange} required className={inputCls}><option value="">Select LGA...</option>{LGAS.map(l => <option key={l}>{l}</option>)}</select></div>
                      <div><label className={labelCls}>Community</label><input type="text" name="community" value={voiceForm.community} onChange={handleVoiceChange} className={inputCls} placeholder="Community" /></div>
                    </div>
                    <button type="submit" disabled={voiceLoading} className="w-full bg-[#f97316] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#01381d] transition-colors disabled:opacity-60">{voiceLoading ? 'Submitting...' : 'Submit Issue'}</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 h-fit">
              <h4 className="font-bold text-lg mb-4">Submission Status</h4>
              <div className="space-y-2 text-sm text-gray-600"><div className="p-3 bg-white rounded-xl border border-gray-100">🟡 Received</div><div className="p-3 bg-white rounded-xl border border-gray-100">🟠 Under Review</div><div className="p-3 bg-white rounded-xl border border-gray-100">🟢 Answered</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WOMEN IN BUSINESS */}
      <section id="women-in-business" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Section 3</div>
            <h2 className={sectionTitleCls}>Women in <span className="text-[#015b2d]">Business</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">A growing directory connecting women-owned businesses to customers, partners, and opportunities.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={cardCls}>
                <div className={cardHeaderCls}><h4 className="font-bold text-lg">Register Your Business</h4><p className="text-sm text-gray-300">List your business in the directory for free.</p></div>
                <div className={cardBodyCls}>
                  <form onSubmit={submitBusiness} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className={labelCls}>Business Name</label><input type="text" name="business_name" value={bizForm.business_name} onChange={handleBizChange} required className={inputCls} placeholder="Business name" /></div>
                      <div><label className={labelCls}>Owner Name</label><input type="text" name="owner_name" value={bizForm.owner_name} onChange={handleBizChange} required className={inputCls} placeholder="Owner name" /></div>
                      <div><label className={labelCls}>Email Address</label><input type="email" name="email" value={bizForm.email} onChange={handleBizChange} required className={inputCls} placeholder="Your email address" /></div>
                      <div><label className={labelCls}>Category</label><select name="category" value={bizForm.category} onChange={handleBizChange} required className={inputCls}><option value="">Select...</option>{BIZ_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                      <div><label className={labelCls}>LGA</label><select name="lga" value={bizForm.lga} onChange={handleBizChange} required className={inputCls}><option value="">Select LGA...</option>{LGAS.map(l => <option key={l}>{l}</option>)}</select></div>
                      <div><label className={labelCls}>Phone Number</label><input type="tel" name="phone" value={bizForm.phone} onChange={handleBizChange} required className={inputCls} placeholder="Phone number" /></div>
                    </div>
                    <div><label className={labelCls}>Social Media Links</label><input type="text" name="social_links" value={bizForm.social_links} onChange={handleBizChange} className={inputCls} placeholder="Instagram, Facebook, etc." /></div>
                    <div><label className={labelCls}>Business Description</label><textarea name="description" value={bizForm.description} onChange={handleBizChange} required rows={4} className={`${inputCls} resize-none`} placeholder="Describe your business..."></textarea></div>
                    <button type="submit" disabled={bizLoading} className="w-full bg-[#f97316] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#01381d] transition-colors disabled:opacity-60">{bizLoading ? 'Submitting...' : 'Submit'}</button>
                  </form>
                </div>
              </div>
            </div>
            {/* SIDEBAR: Featured Businesses */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
              <h4 className="font-bold text-lg mb-4 text-[#015b2d]">Featured Businesses</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '✂️', name: 'Adesuwa Couture', cat: 'Fashion', loc: 'Oredo' },
                  { icon: '🍳', name: "Iyabo's Kitchen", cat: 'Catering', loc: 'Egor' },
                  { icon: '💄', name: 'Glow Beauty Studio', cat: 'Beauty', loc: 'Ikpoba-Okha' },
                  { icon: '🧺', name: 'Greenfield Farms', cat: 'Agriculture', loc: 'Uhunmwonde' }
                ].map((b, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl mb-2">{b.icon}</div>
                    <h5 className="font-bold text-sm">{b.name}</h5>
                    <p className="text-xs text-gray-500">{b.cat} • {b.loc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WOMEN LEADERS CIRCLE */}
      <section id="leaders-circle" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Section 4</div>
            <h2 className={sectionTitleCls}>Women Leaders <span className="text-[#015b2d]">Circle</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">A distinguished circle for market leaders, community leaders, religious leaders, professionals and entrepreneurs shaping Edo South.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={cardCls}>
                <div className={cardHeaderCls}><h4 className="font-bold text-lg">Application Form</h4><p className="text-sm text-gray-300">Apply to join the Women Leaders Circle.</p></div>
                <div className={cardBodyCls}>
                  <form onSubmit={submitLeader} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className={labelCls}>Full Name</label><input type="text" name="full_name" value={leaderForm.full_name} onChange={handleLeaderChange} required className={inputCls} placeholder="Your full name" /></div>
                      <div><label className={labelCls}>Email Address</label><input type="email" name="email" value={leaderForm.email} onChange={handleLeaderChange} required className={inputCls} placeholder="Your email address" /></div>
                      <div><label className={labelCls}>Position Held</label><input type="text" name="position_held" value={leaderForm.position_held} onChange={handleLeaderChange} required className={inputCls} placeholder="e.g. Market President" /></div>
                      <div><label className={labelCls}>Organization</label><input type="text" name="organization" value={leaderForm.organization} onChange={handleLeaderChange} className={inputCls} placeholder="Organization or community" /></div>
                      <div><label className={labelCls}>Years of Experience</label><input type="number" name="years_of_experience" value={leaderForm.years_of_experience} onChange={handleLeaderChange} className={inputCls} placeholder="e.g. 8" /></div>
                    </div>
                    <div><label className={labelCls}>Community Impact</label><textarea name="community_impact" value={leaderForm.community_impact} onChange={handleLeaderChange} required rows={4} className={`${inputCls} resize-none`} placeholder="Describe your impact on the community..."></textarea></div>
                    <button type="submit" disabled={leaderLoading} className="w-full bg-[#f97316] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#01381d] transition-colors disabled:opacity-60">{leaderLoading ? 'Submitting...' : 'Submit Application'}</button>
                  </form>
                </div>
              </div>
            </div>
            {/* SIDEBAR: Circle Benefits & Featured Members */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-bold text-lg mb-3 text-[#f97316]">Circle Benefits</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#015b2d]">✓</span> Leadership recognition across the MAI network.</li>
                  <li className="flex gap-2"><span className="text-[#015b2d]">✓</span> Invitations to special events and exclusive gatherings.</li>
                  <li className="flex gap-2"><span className="text-[#015b2d]">✓</span> Direct policy engagement and a seat at the table with MAI.</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-bold text-lg mb-4 text-[#015b2d]">Featured Circle Members</h4>
                <div className="space-y-4">
                  {[
                    { name: 'Mrs. Grace Edobor', role: 'Market Leader', org: 'New Benin Market' },
                    { name: 'Pastor (Mrs.) Joy Aimuanmwosa', role: 'Religious Leader', org: 'Faith Community' },
                    { name: 'Dr. Esohe Obasuyi', role: 'Professional', org: 'Medical Practitioner' }
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">👤</div>
                      <div>
                        <div className="font-bold text-sm">{m.name}</div>
                        <div className="text-xs text-gray-500">{m.role} • {m.org}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WOMEN OPPORTUNITIES HUB */}
      <section id="opportunities-hub" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Section 5</div>
            <h2 className={sectionTitleCls}>Women Opportunities <span className="text-[#015b2d]">Hub</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Scholarships, internships, grants, fellowships, job opportunities, skills training and competitions — all in one place for women across Edo South.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { type: 'Scholarship', title: "MAI Women's Education Scholarship", desc: 'Tuition support for female students in tertiary institutions across Edo South.' },
              { type: 'Grant', title: 'Women in Business Micro-Grant', desc: 'Seed funding for women-owned small businesses and cooperatives.' },
              { type: 'Skills Training', title: 'Digital Skills Bootcamp for Women', desc: 'Free hands-on training in digital tools, e-commerce, and tech basics.' },
              { type: 'Internship', title: 'Women in Governance Internship', desc: 'Hands-on exposure to policy and public service for young women.' },
              { type: 'Fellowship', title: 'MAI Women Leadership Fellowship', desc: 'A year-long leadership development program for emerging women leaders.' },
              { type: 'Competition', title: 'Young Women Innovators Challenge', desc: 'A pitch competition for women-led innovative solutions to local problems.' }
            ].map((o, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <span className="inline-block text-xs font-bold text-[#f97316] bg-[#f97316]/10 px-3 py-1 rounded-full mb-3">{o.type}</span>
                <h4 className="font-bold text-lg mb-2">{o.title}</h4>
                <p className="text-sm text-gray-500">{o.desc}</p>
                <div className="text-xs text-gray-400 mt-4">⏳ Applications open</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WOMEN OF IMPACT */}
      <section id="women-of-impact" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Section 6</div>
            <h2 className={sectionTitleCls}>Women of <span className="text-[#015b2d]">Impact</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Celebrating women who are transforming Edo South — in education, business, healthcare, community service, and youth development.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={cardCls}>
                <div className={cardHeaderCls}><h4 className="font-bold text-lg">Nomination Form</h4><p className="text-sm text-gray-300">Nominate a woman making a difference.</p></div>
                <div className={cardBodyCls}>
                  <form onSubmit={submitNomination} className="space-y-4">
                    <div><label className={labelCls}>Your Email (Nominator)</label><input type="email" name="email" value={nomForm.email} onChange={handleNomChange} required className={inputCls} placeholder="Your email address" /></div>
                    <div><label className={labelCls}>Nominee Name</label><input type="text" name="nominee_name" value={nomForm.nominee_name} onChange={handleNomChange} required className={inputCls} placeholder="Full name of nominee" /></div>
                    <div><label className={labelCls}>Category</label><select name="category" value={nomForm.category} onChange={handleNomChange} className={inputCls}>{IMPACT_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                    <div><label className={labelCls}>Achievements</label><textarea name="achievements" value={nomForm.achievements} onChange={handleNomChange} required rows={4} className={`${inputCls} resize-none`} placeholder="Describe their achievements and impact..."></textarea></div>
                    <button type="submit" disabled={nomLoading} className="w-full bg-[#f97316] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#01381d] transition-colors disabled:opacity-60">{nomLoading ? 'Submitting...' : 'Submit Nomination'}</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 h-fit">
              <h4 className="font-bold text-lg mb-4">Monthly Spotlight</h4>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-3">👩</div>
                <h5 className="font-bold text-base">Mrs. Patience Omoregie</h5>
                <p className="text-xs text-gray-500 mb-2">Featured this month</p>
                <p className="text-xs text-gray-600">Honored for outstanding work expanding maternal healthcare access in rural communities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WOMEN'S DEVELOPMENT SURVEY */}
      <section id="development-survey" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="text-2xl font-bold mb-2">Women&apos;s Development <span className="text-[#015b2d]">Survey</span></div>
              <p className="text-gray-500 mb-6">Your answers directly inform MAI&apos;s priorities for women across Edo South. Takes less than 2 minutes.</p>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="w-full bg-gray-100 rounded-full h-2 mb-6"><div className="bg-[#015b2d] h-2 rounded-full" style={{ width: '0%' }}></div></div>
                <p className="font-semibold mb-3">1. What is the biggest challenge facing women in your community?</p>
                <div className="grid md:grid-cols-2 gap-2 mb-6">
                  {['Access to Finance', 'Healthcare', 'Education', 'Security', 'Unemployment', 'Skills Development'].map(q => <button key={q} className="text-sm font-medium text-gray-700 border-2 border-gray-200 rounded-full px-4 py-2 hover:border-[#015b2d] hover:bg-gray-50">{q}</button>)}
                </div>
                <button className="w-full bg-[#f97316] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#01381d] transition-colors">Submit Survey</button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
              <h4 className="font-bold text-lg mb-3 text-[#015b2d]">Why It Matters</h4>
              <p className="text-sm text-gray-500 mb-4">Every quarter, survey results are compiled and shared directly with the MAI campaign team to shape policy priorities, programs, and resource allocation for women across all 7 LGAs of Edo South.</p>
              <div className="p-3 bg-[#015b2d]/5 border border-[#015b2d]/20 rounded-xl text-sm font-semibold text-[#015b2d]">🛡️ Your responses are anonymous.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. EVENTS & TRAININGS */}
      <section id="events-trainings" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Section 8</div>
            <h2 className={sectionTitleCls}>Events & <span className="text-[#015b2d]">Trainings</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { day: '14', mon: 'Jul', title: 'Women in Business Summit', loc: 'Benin City' },
              { day: '21', mon: 'Jul', title: 'Digital Skills Training', loc: 'Ikpoba-Okha' },
              { day: '02', mon: 'Aug', title: 'Maternal Health Outreach', loc: 'Orhionmwon' },
              { day: '15', mon: 'Aug', title: 'Women Leaders Circle Dinner', loc: 'Oredo' }
            ].map((e, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-4 items-center">
                <div className="bg-[#015b2d] text-white rounded-xl w-14 h-14 flex flex-col items-center justify-center shrink-0"><span className="text-xl font-bold">{e.day}</span><span className="text-[10px] uppercase">{e.mon}</span></div>
                <div>
                  <div className="font-bold text-sm mb-1">{e.title}</div>
                  <div className="text-xs text-gray-500">📍 {e.loc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}