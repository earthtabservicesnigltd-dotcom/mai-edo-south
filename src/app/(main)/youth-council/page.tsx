'use client'
import { useState } from 'react'
import { toast } from 'sonner'

const LGAS = [
  'Akoko-Edo','Egor','Esan Central','Esan North-East','Esan South-East','Esan West',
  'Etsako Central','Etsako East','Etsako West','Igueben','Ikpoba-Okha','Orhionmwon',
  'Oredo','Ovia North-East','Ovia South-West','Owan East','Owan West','Uhunmwonde',
]

export default function YouthCouncilPage() {
  // Registration Form State
  const [regForm, setRegForm] = useState({
    full_name: '', date_of_birth: '', gender: '', phone: '', whatsapp_number: '', email: '',
    lga: '', ward: '', community: '', education: '', occupation: ''
  })
  const [regLoading, setRegLoading] = useState(false)
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([])

  // Voice Form State
  const [voiceForm, setVoiceForm] = useState({ category: '', title: '', message: '', lga: '', community: '' })
  const [voiceLoading, setVoiceLoading] = useState(false)

  // Idea Form State
  const [ideaForm, setIdeaForm] = useState({ idea_type: '', title: '', description: '', lga: '' })
  const [ideaLoading, setIdeaLoading] = useState(false)

  // Nomination Form State
  const [nomForm, setNomForm] = useState({ nominee_name: '', award_category: 'Young Leader of the Month', lga: '', nominee_contact: '', reason: '' })
  const [nomLoading, setNomLoading] = useState(false)

  // Handlers
  const handleRegChange = (e: any) => setRegForm({ ...regForm, [e.target.name]: e.target.value })
  const handleVoiceChange = (e: any) => setVoiceForm({ ...voiceForm, [e.target.name]: e.target.value })
  const handleIdeaChange = (e: any) => setIdeaForm({ ...ideaForm, [e.target.name]: e.target.value })
  const handleNomChange = (e: any) => setNomForm({ ...nomForm, [e.target.name]: e.target.value })

  const toggleArea = (area: string) => {
    setAreasOfInterest(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area])
  }

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegLoading(true)
    try {
      const res = await fetch('/api/youth-council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...regForm, areas_of_interest: areasOfInterest })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Registration Successful!', { description: 'Welcome to the MAI Youth Council.' })
      setRegForm({ full_name: '', date_of_birth: '', gender: '', phone: '', whatsapp_number: '', email: '', lga: '', ward: '', community: '', education: '', occupation: '' })
      setAreasOfInterest([])
    } catch (err: any) {
      toast.error(err.message || 'Submission failed')
    } finally {
      setRegLoading(false)
    }
  }

  const submitVoice = async (e: React.FormEvent) => {
    e.preventDefault()
    setVoiceLoading(true)
    try {
      const res = await fetch('/api/youth-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voiceForm)
      })
      if (!res.ok) throw new Error('Failed to submit')
      toast.success('Voice Submitted!', { description: 'Thank you for sharing your concern.' })
      setVoiceForm({ category: '', title: '', message: '', lga: '', community: '' })
    } catch {
      toast.error('Submission failed')
    } finally {
      setVoiceLoading(false)
    }
  }

  const submitIdea = async (e: React.FormEvent) => {
    e.preventDefault()
    setIdeaLoading(true)
    try {
      const res = await fetch('/api/youth-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideaForm)
      })
      if (!res.ok) throw new Error('Failed to submit')
      toast.success('Idea Submitted!', { description: 'Your project idea has been received.' })
      setIdeaForm({ idea_type: '', title: '', description: '', lga: '' })
    } catch {
      toast.error('Submission failed')
    } finally {
      setIdeaLoading(false)
    }
  }

  const submitNomination = async (e: React.FormEvent) => {
    e.preventDefault()
    setNomLoading(true)
    try {
      const res = await fetch('/api/youth-nominations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nomForm)
      })
      if (!res.ok) throw new Error('Failed to submit')
      toast.success('Nomination Submitted!', { description: 'Thank you for nominating a youth champion.' })
      setNomForm({ nominee_name: '', award_category: 'Young Leader of the Month', lga: '', nominee_contact: '', reason: '' })
    } catch {
      toast.error('Submission failed')
    } finally {
      setNomLoading(false)
    }
  }

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
          <h6 className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">MAI YOUTH COUNCIL</h6>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">Youth <span className="text-[#f97316]">Council</span></h1>
          <p className="text-gray-200 text-lg max-w-xl mx-auto">Inspiring Leadership. Creating Opportunities. Building the Future.</p>
        </div>
      </section>

      {/* 1. JOIN THE COUNCIL */}
      <section id="join-council" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Section 1</div>
            <h2 className={sectionTitleCls}>Join the <span className="text-[#015b2d]">Council</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Become a registered member of the MAI Youth Council and unlock opportunities, programs, and a community of young leaders.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={cardCls}>
                <div className={cardHeaderCls}>
                  <h4 className="font-bold text-lg">Registration Form</h4>
                  <p className="text-sm text-gray-300">Sign up to join the council.</p>
                </div>
                <div className={cardBodyCls}>
                  <form onSubmit={submitRegistration} className="space-y-6">
                    
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Personal Information</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div><label className={labelCls}>Full Name</label><input type="text" name="full_name" value={regForm.full_name} onChange={handleRegChange} required className={inputCls} placeholder="Your full name" /></div>
                        <div><label className={labelCls}>Date of Birth</label><input type="date" name="date_of_birth" value={regForm.date_of_birth} onChange={handleRegChange} className={inputCls} /></div>
                        <div><label className={labelCls}>Gender</label><select name="gender" value={regForm.gender} onChange={handleRegChange} className={inputCls}><option value="">Select...</option><option>Male</option><option>Female</option></select></div>
                        <div><label className={labelCls}>Phone Number</label><input type="tel" name="phone" value={regForm.phone} onChange={handleRegChange} required className={inputCls} placeholder="Phone number" /></div>
                        <div><label className={labelCls}>WhatsApp Number</label><input type="tel" name="whatsapp_number" value={regForm.whatsapp_number} onChange={handleRegChange} className={inputCls} placeholder="WhatsApp number" /></div>
                        <div><label className={labelCls}>Email Address</label><input type="email" name="email" value={regForm.email} onChange={handleRegChange} required className={inputCls} placeholder="Email address" /></div>
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
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Education & Occupation</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div><label className={labelCls}>Education</label><select name="education" value={regForm.education} onChange={handleRegChange} className={inputCls}><option value="">Select...</option><option>Secondary School Student</option><option>Undergraduate</option><option>Graduate</option><option>NYSC Member</option><option>Postgraduate</option><option>Other</option></select></div>
                        <div><label className={labelCls}>Occupation</label><select name="occupation" value={regForm.occupation} onChange={handleRegChange} className={inputCls}><option value="">Select...</option><option>Student</option><option>Entrepreneur</option><option>Professional</option><option>Artisan</option><option>Civil Servant</option><option>Job Seeker</option></select></div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Areas of Interest</p>
                      <div className="flex flex-wrap gap-2">
                        {['Leadership', 'Politics & Governance', 'Entrepreneurship', 'Technology', 'Agriculture', 'Community Development', 'Media & Communication', 'Education', 'Sports', 'Volunteerism'].map(area => (
                          <button type="button" key={area} onClick={() => toggleArea(area)} className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${areasOfInterest.includes(area) ? 'bg-[#015b2d] text-white border-[#015b2d]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#015b2d]'}`}>
                            {area}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button type="submit" disabled={regLoading} className="w-full bg-[#f97316] text-white font-bold py-3.5 rounded-xl hover:bg-[#01381d] transition-colors disabled:opacity-60">
                      {regLoading ? 'Submitting...' : 'Register & Join'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-bold text-lg mb-3 text-[#015b2d]">Membership Benefits</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Membership ID Number</li>
                  <li>✅ Digital Youth Council ID Card</li>
                  <li>✅ Welcome Email</li>
                  <li>✅ Access to Opportunities Hub</li>
                  <li>✅ Event Invitations</li>
                  <li>✅ Leadership Programs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. YOUTH VOICE */}
      <section id="youth-voice" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Section 2</div>
            <h2 className={sectionTitleCls}>Youth <span className="text-[#015b2d]">Voice</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">A dedicated space where youths can express concerns, suggestions, development ideas, and policy recommendations directly to MAI.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={cardCls}>
                <div className={cardHeaderCls}>
                  <h4 className="font-bold text-lg">Share Your Voice</h4>
                  <p className="text-sm text-gray-300">Tell MAI what matters most to you.</p>
                </div>
                <div className={cardBodyCls}>
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">What Are You Sharing?</p>
                    <div className="flex flex-wrap gap-2">
                      {['Concerns', 'Suggestions', 'Development Ideas', 'Policy Recommendations'].map(cat => (
                        <button type="button" key={cat} onClick={() => setVoiceForm({...voiceForm, category: cat})} className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${voiceForm.category === cat ? 'bg-[#015b2d] text-white border-[#015b2d]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#015b2d]'}`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={submitVoice} className="space-y-4">
                    <div><label className={labelCls}>Title</label><input type="text" name="title" value={voiceForm.title} onChange={handleVoiceChange} required className={inputCls} placeholder="Give your submission a short title" /></div>
                    <div><label className={labelCls}>Your Message</label><textarea name="message" value={voiceForm.message} onChange={handleVoiceChange} required rows={5} className={`${inputCls} resize-none`} placeholder="Share your concern, suggestion, idea, or recommendation..."></textarea></div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className={labelCls}>LGA</label><select name="lga" value={voiceForm.lga} onChange={handleVoiceChange} required className={inputCls}><option value="">Select LGA...</option>{LGAS.map(l => <option key={l}>{l}</option>)}</select></div>
                      <div><label className={labelCls}>Community</label><input type="text" name="community" value={voiceForm.community} onChange={handleVoiceChange} className={inputCls} placeholder="Community" /></div>
                    </div>
                    <button type="submit" disabled={voiceLoading} className="w-full bg-[#f97316] text-white font-bold py-3.5 px-6 rounded-xl hover:bg-[#01381d] transition-colors disabled:opacity-60">
                      {voiceLoading ? 'Submitting...' : 'Submit My Voice'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 h-fit">
              <h4 className="font-bold text-lg mb-4">Submission Status</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="p-3 bg-white rounded-xl border border-gray-100">🟡 Received</div>
                <div className="p-3 bg-white rounded-xl border border-gray-100">🟠 Under Review</div>
                <div className="p-3 bg-white rounded-xl border border-gray-100">🟢 Addressed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. YOUTH PROJECTS & IDEAS BANK */}
      <section id="ideas-bank" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Section 3</div>
            <h2 className={sectionTitleCls}>Youth Projects & <span className="text-[#015b2d]">Ideas Bank</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Young people submit community projects, business ideas, technology solutions, and social impact initiatives.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={cardCls}>
                <div className={cardHeaderCls}>
                  <h4 className="font-bold text-lg">Submit Your Idea</h4>
                  <p className="text-sm text-gray-300">Share what you'd build for your community.</p>
                </div>
                <div className={cardBodyCls}>
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Idea Type</p>
                    <div className="flex flex-wrap gap-2">
                      {['Community Project', 'Business Idea', 'Technology Solution', 'Social Impact Initiative'].map(type => (
                        <button type="button" key={type} onClick={() => setIdeaForm({...ideaForm, idea_type: type})} className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${ideaForm.idea_type === type ? 'bg-[#015b2d] text-white border-[#015b2d]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#015b2d]'}`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={submitIdea} className="space-y-4">
                    <div><label className={labelCls}>Idea Title</label><input type="text" name="title" value={ideaForm.title} onChange={handleIdeaChange} required className={inputCls} placeholder="Give your idea a name" /></div>
                    <div><label className={labelCls}>Describe Your Idea</label><textarea name="description" value={ideaForm.description} onChange={handleIdeaChange} required rows={5} className={`${inputCls} resize-none`} placeholder="Explain your idea and the problem it solves..."></textarea></div>
                    <div><label className={labelCls}>LGA</label><select name="lga" value={ideaForm.lga} onChange={handleIdeaChange} required className={inputCls}><option value="">Select LGA...</option>{LGAS.map(l => <option key={l}>{l}</option>)}</select></div>
                    <button type="submit" disabled={ideaLoading} className="w-full bg-[#f97316] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#01381d] transition-colors disabled:opacity-60">
                      {ideaLoading ? 'Submitting...' : 'Submit Idea'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RECOGNITION & AWARDS */}
      <section id="recognition-awards" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Section 4</div>
            <h2 className={sectionTitleCls}>Recognition & <span className="text-[#015b2d]">Awards</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Celebrating outstanding young people across Edo South who lead, innovate, volunteer, and inspire their communities.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={cardCls}>
                <div className={cardHeaderCls}>
                  <h4 className="font-bold text-lg">Nominate a Youth Champion</h4>
                  <p className="text-sm text-gray-300">Know someone making a difference? Put them forward.</p>
                </div>
                <div className={cardBodyCls}>
                  <form onSubmit={submitNomination} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className={labelCls}>Nominee&apos;s Full Name</label><input type="text" name="nominee_name" value={nomForm.nominee_name} onChange={handleNomChange} required className={inputCls} placeholder="Who are you nominating?" /></div>
                      <div><label className={labelCls}>Award Category</label><select name="award_category" value={nomForm.award_category} onChange={handleNomChange} className={inputCls}><option>Young Leader of the Month</option><option>Innovator of the Month</option><option>Volunteer of the Month</option><option>Community Champion</option></select></div>
                      <div><label className={labelCls}>LGA</label><select name="lga" value={nomForm.lga} onChange={handleNomChange} required className={inputCls}><option value="">Select LGA...</option>{LGAS.map(l => <option key={l}>{l}</option>)}</select></div>
                      <div><label className={labelCls}>Contact (Phone/Email)</label><input type="text" name="nominee_contact" value={nomForm.nominee_contact} onChange={handleNomChange} className={inputCls} placeholder="Nominee's contact" /></div>
                    </div>
                    <div><label className={labelCls}>Why do they deserve this award?</label><textarea name="reason" value={nomForm.reason} onChange={handleNomChange} required rows={4} className={`${inputCls} resize-none`} placeholder="Describe their impact and contributions..."></textarea></div>
                    <button type="submit" disabled={nomLoading} className="w-full bg-[#f97316] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#01381d] transition-colors disabled:opacity-60">
                      {nomLoading ? 'Submitting...' : 'Submit Nomination'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}