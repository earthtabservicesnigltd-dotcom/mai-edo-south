'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { supabaseBrowser } from '@/lib/supabase'

function getYouTubeID(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

const LGAS = [
  'Akoko-Edo','Egor','Esan Central','Esan North-East','Esan South-East','Esan West',
  'Etsako Central','Etsako East','Etsako West','Igueben','Ikpoba-Okha','Orhionmwon',
  'Oredo','Ovia North-East','Ovia South-West','Owan East','Owan West','Uhunmwonde',
]
const IMPACT_CATEGORIES = ['Education', 'Youth Development', 'Community Development', 'Business Support', 'Leadership & Mentorship', 'Healthcare', 'Employment', 'Philanthropy', 'Personal Support', 'Other']

export default function MAIImpactPage() {
  const [form, setForm] = useState({
    full_name: '', phone: '', email: '', community: '', lga: '', state_country: '', title: '', story: '', impact_category: ''
  })
  const [consents, setConsents] = useState({ is_true: false, can_publish: false, anonymous: false })
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])

   // Add this effect to fetch testimonials
  useEffect(() => {
    async function fetchTestimonials() {
      const res = await fetch('/api/testimonials')
      const data = await res.json()
      if (res.ok) setTestimonials(data.testimonials || [])
    }
    fetchTestimonials()
  }, [])

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })
  const toggleConsent = (key: 'is_true' | 'can_publish' | 'anonymous') => {
    setConsents(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consents.is_true || !consents.can_publish) {
      toast.error('Please confirm the information is true and authorize publication.')
      return
    }
    setLoading(true)

    let file_urls: string[] = []

    try {
      // 1. Upload files to Supabase if any exist
      if (files.length > 0) {
        toast.loading('Uploading files...', { id: 'file-upload' })
        const supabase = supabaseBrowser()
        
        for (const file of files) {
          const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
          const filePath = `evidence/${Date.now()}-${safeName}`
          
          const { error } = await supabase.storage
            .from('mai-impact-uploads')
            .upload(filePath, file, { contentType: file.type })

          if (error) throw error
          
          const { data: publicUrlData } = supabase.storage
            .from('mai-impact-uploads')
            .getPublicUrl(filePath)
            
          file_urls.push(publicUrlData.publicUrl)
        }
        toast.success('Files uploaded!', { id: 'file-upload' })
      }

      // 2. Submit Form Data + File URLs to Database
      const res = await fetch('/api/mai-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...consents, file_urls })
      })
      if (!res.ok) throw new Error('Failed to submit')
      
      toast.success('Story Submitted!', { description: 'Thank you for sharing your impact story.' })
      setForm({ full_name: '', phone: '', email: '', community: '', lga: '', state_country: '', title: '', story: '', impact_category: '' })
      setConsents({ is_true: false, can_publish: false, anonymous: false })
      setFiles([])
    } catch (err: any) {
      toast.dismiss('file-upload')
      toast.error(err.message || 'Submission failed')
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
          <h6 className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">REAL STORIES. REAL PEOPLE. REAL IMPACT.</h6>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">MAI <span className="text-[#f97316]">Impact</span></h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto italic mb-8">&ldquo;Share your experience with MAI and tell the world how a single act of kindness, leadership, support, or mentorship made a difference in your life or community.&rdquo;</p>
          <a href="#story-form" className="inline-flex items-center gap-2 bg-[#f97316] text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-[#f97316] transition-colors">Share Your Story</a>
        </div>
      </section>

      {/* STORY SUBMISSION FORM */}
      <section id="story-form" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Tell us what happened</div>
            <h2 className="font-heading text-4xl md:text-5xl mb-2">Story Submission <span className="text-[#015b2d]">Form</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Every story helps show the real, on-the-ground impact of MAI&apos;s work across Edo South.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={cardCls}>
                <div className={cardHeaderCls}>
                  <h4 className="font-bold text-lg">Share Your Story</h4>
                  <p className="text-sm text-gray-300">Tell us about your experience with MAI.</p>
                </div>
                <div className={cardBodyCls}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Personal Information</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div><label className={labelCls}>Full Name</label><input type="text" name="full_name" value={form.full_name} onChange={handleChange} required className={inputCls} placeholder="Your full name" /></div>
                        <div><label className={labelCls}>Phone Number</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} required className={inputCls} placeholder="Phone number" /></div>
                        <div><label className={labelCls}>Email Address (Optional)</label><input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="Email address" /></div>
                        <div><label className={labelCls}>Community</label><input type="text" name="community" value={form.community} onChange={handleChange} className={inputCls} placeholder="Community" /></div>
                        <div><label className={labelCls}>LGA</label><select name="lga" value={form.lga} onChange={handleChange} required className={inputCls}><option value="">Select LGA...</option>{LGAS.map(l => <option key={l}>{l}</option>)}</select></div>
                        <div><label className={labelCls}>State/Country</label><input type="text" name="state_country" value={form.state_country} onChange={handleChange} className={inputCls} placeholder="e.g. Edo State, Nigeria" /></div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Your MAI Impact Story</p>
                      <div><label className={labelCls}>Story Title</label><input type="text" name="title" value={form.title} onChange={handleChange} required className={inputCls} placeholder="Give your story a title" /></div>
                      <div className="mt-4"><label className={labelCls}>Tell Your Story</label><textarea name="story" value={form.story} onChange={handleChange} required rows={6} className={`${inputCls} resize-none`} placeholder="Please tell us about your experience with MAI..."></textarea></div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Impact Category</p>
                      <div className="flex flex-wrap gap-2">
                        {IMPACT_CATEGORIES.map(cat => (
                          <button type="button" key={cat} onClick={() => setForm({...form, impact_category: cat})} className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${form.impact_category === cat ? 'bg-[#015b2d] text-white border-[#015b2d]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#015b2d]'}`}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Upload Evidence (Optional)</p>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Drag & drop files here, or click to browse</p>
                        <div className="flex justify-center gap-4 text-xs text-gray-500 mb-4">
                          <span>📷 Photos</span><span>📄 Documents</span><span>✉️ Letters</span><span>🎥 Videos</span>
                        </div>
                        <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="px-4 py-2 bg-[#f97316] text-white text-xs font-bold rounded-xl hover:bg-[#01381d] transition-colors cursor-pointer">
                          Select Files
                        </label>
                        {files.length > 0 && (
                          <div className="mt-4 text-left text-sm text-gray-600 space-y-1">
                            {files.map((f, i) => <p key={i}>✓ {f.name}</p>)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Consent</p>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={consents.is_true} onChange={() => toggleConsent('is_true')} className="mt-1 w-4 h-4 accent-[#015b2d]" />
                          <span className="text-sm text-gray-700">I confirm that the information provided is true and accurate.</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={consents.can_publish} onChange={() => toggleConsent('can_publish')} className="mt-1 w-4 h-4 accent-[#015b2d]" />
                          <span className="text-sm text-gray-700">I authorize MAI Impact to publish my story.</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={consents.anonymous} onChange={() => toggleConsent('anonymous')} className="mt-1 w-4 h-4 accent-[#015b2d]" />
                          <span className="text-sm text-gray-700">I wish to remain anonymous.</span>
                        </label>
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#f97316] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#01381d] transition-colors disabled:opacity-60">
                      {loading ? 'Submitting...' : 'SHARE MY STORY'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-heading text-xl text-[#015b2d] mb-4">Why Share?</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#015b2d]">✓</span> Your story can inspire others facing similar challenges.</li>
                  <li className="flex gap-2"><span className="text-[#015b2d]">✓</span> Help show the real, on-the-ground impact of MAI&apos;s work.</li>
                  <li className="flex gap-2"><span className="text-[#015b2d]">✓</span> You choose what gets published — anonymity is respected.</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-heading text-xl text-[#015b2d] mb-4">What Happens Next</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="p-3 bg-gray-50 rounded-xl">🟡 Story Received</div>
                  <div className="p-3 bg-gray-50 rounded-xl">🟠 Under Review</div>
                  <div className="p-3 bg-gray-50 rounded-xl">🟢 Featured / Published</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED STORIES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Featured Stories</div>
            <h2 className="font-heading text-4xl md:text-5xl mb-2">Featured Impact <span className="text-[#015b2d]">Stories</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Real stories from real people across Edo South.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'How MAI Helped Revive Our Community School', author: 'Mrs. Grace', loc: 'Orhionmwon' },
              { title: 'A Scholarship Opportunity That Changed My Life', author: 'Osaze', loc: 'Oredo' },
              { title: 'A Leader Who Showed Up When We Needed Help', author: 'Community Youth Leader', loc: 'Ovia North-East' }
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <div className="text-3xl text-[#f97316]/40 mb-2">&ldquo;</div>
                <p className="font-medium text-gray-800 mb-4 flex-1">{s.title}</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">👤</div>
                  <div>
                    <div className="font-bold text-sm">{s.author}</div>
                    <div className="text-xs text-gray-500">{s.loc}</div>
                  </div>
                </div>
                <a href="#" className="text-sm font-semibold text-[#015b2d] hover:text-[#f97316] transition-colors">Read More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO TESTIMONIALS & STATS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Hear it from them</div>
            <h2 className="font-heading text-4xl md:text-5xl mb-2">Video <span className="text-[#015b2d]">Testimonials</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Watch citizens across Edo South share their MAI impact stories in their own words.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {!testimonials || testimonials.length === 0 ? (
              // Fallback dummy data if database is empty
              <>
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-[#01381d] rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
                    <div className="w-14 h-14 rounded-full bg-white/90 text-[#015b2d] flex items-center justify-center text-xl cursor-pointer hover:scale-105 transition-transform z-10">▶</div>
                    <div className="absolute bottom-4 left-4 text-white font-semibold text-sm z-10">Testimonial {i}</div>
                  </div>
                ))}
              </>
            ) : (
              testimonials.map(t => {
                const videoId = getYouTubeID(t.youtube_url)
                if (!videoId) return null
                return (
                  <div key={t.id} className="bg-[#01381d] rounded-2xl aspect-video overflow-hidden relative">
                    <iframe 
                      src={`https://www.youtube.com/embed/${videoId}`} 
                      title={t.title} 
                      className="w-full h-full"
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    />
                  </div>
                )
              })
            )}
          </div>

          <div className="text-center mb-8">
            <div className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Impact Wall</div>
            <h2 className="font-heading text-3xl md:text-4xl">MAI Impact Across <span className="text-[#015b2d]">Communities</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: '500+', label: 'Stories Shared' },
              { num: '120', label: 'Communities Represented' },
              { num: '7', label: 'LGAs Covered' },
              { num: '500', label: 'Video Testimonials' }
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                <div className="font-heading text-3xl text-[#01381d]">{s.num}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}