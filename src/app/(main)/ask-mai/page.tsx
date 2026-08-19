'use client'
import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { supabaseBrowser } from '@/lib/supabase'

const LGAS = [
  'Akoko-Edo','Egor','Esan Central','Esan North-East','Esan South-East','Esan West',
  'Etsako Central','Etsako East','Etsako West','Igueben','Ikpoba-Okha','Orhionmwon',
  'Oredo','Ovia North-East','Ovia South-West','Owan East','Owan West','Uhunmwonde',
]
const CATEGORIES = ['Youth & Employment', 'Education', 'Healthcare', 'Infrastructure', 'Security', 'Economy & Business', 'Women Affairs', 'Agriculture', 'Environment', 'Diaspora Affairs', 'Politics & Governance', 'General Questions']

// 1 Minute Max Recording, 15MB Max File Size
const MAX_RECORDING_SEC = 60 
const MAX_FILE_SIZE_MB = 15
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

// Official Supabase Browser Uploader
async function uploadToSupabase(blob: Blob, type: 'video' | 'attachment', fileName: string) {
  const supabase = supabaseBrowser()
  const folder = type === 'video' ? 'videos' : 'attachments'
  const safeName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const filePath = `${folder}/${Date.now()}-${safeName}`
  
  const { error } = await supabase.storage
    .from('ask-mai-uploads')
    .upload(filePath, blob, { 
      contentType: blob.type || 'application/octet-stream',
      cacheControl: '3600'
    })
    
  if (error) throw new Error(error.message)
  
  const { data: publicUrlData } = supabase.storage
    .from('ask-mai-uploads')
    .getPublicUrl(filePath)
    
  return publicUrlData.publicUrl
}

export default function AskMAIPage() {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', lga: '', community: '', category: '', title: '', question: ''
  })
  const [loading, setLoading] = useState(false)
  
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordTime, setRecordTime] = useState(0)
  
  const liveVideoRef = useRef<HTMLVideoElement>(null)
  const recordedVideoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`Attachment is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`)
        return
      }
      setAttachmentFile(file)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream
        liveVideoRef.current.style.display = 'block'
        if (recordedVideoRef.current) recordedVideoRef.current.style.display = 'none'
      }
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        
        if (blob.size > MAX_FILE_SIZE_BYTES) {
          toast.error(`Video is too large. Please record a shorter video (max ${MAX_FILE_SIZE_MB}MB).`)
          setVideoBlob(null)
        } else {
          setVideoBlob(blob)
          if (recordedVideoRef.current) {
            recordedVideoRef.current.src = URL.createObjectURL(blob)
            recordedVideoRef.current.style.display = 'block'
            if (liveVideoRef.current) liveVideoRef.current.style.display = 'none'
          }
        }
        stream.getTracks().forEach(track => track.stop()) // Stop camera
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordTime(0)
      
      timerRef.current = setInterval(() => {
        setRecordTime(prev => {
          if (prev >= MAX_RECORDING_SEC) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)

    } catch (err) {
      toast.error('Could not access camera/microphone.')
    }
  }

  const redoRecording = () => {
    setVideoBlob(null)
    startRecording()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    let video_url = null
    let attachment_url = null

    try {
      // 1. Upload Video if exists
      if (videoBlob) {
        toast.loading('Uploading video...', { id: 'video-upload' })
        try {
          video_url = await uploadToSupabase(videoBlob, 'video', 'question.webm')
          toast.success('Video uploaded!', { id: 'video-upload' })
        } catch (err: any) {
          toast.error(err.message || 'Video upload failed', { id: 'video-upload' })
          throw err // Stop the whole submission if upload fails
        }
      }

      // 2. Upload Attachment if exists
      if (attachmentFile) {
        toast.loading('Uploading attachment...', { id: 'file-upload' })
        try {
          attachment_url = await uploadToSupabase(attachmentFile, 'attachment', attachmentFile.name)
          toast.success('Attachment uploaded!', { id: 'file-upload' })
        } catch (err: any) {
          toast.error(err.message || 'Attachment upload failed', { id: 'file-upload' })
          throw err
        }
      }

      // 3. Submit Form Data + URLs to Database
      const res = await fetch('/api/ask-mai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          video_url,
          attachment_url
        })
      })
      if (!res.ok) throw new Error('Failed to submit form')
      
      toast.success('Question Submitted!', { description: 'Your question has been received.' })
      
      // Reset form
      setForm({ full_name: '', email: '', phone: '', lga: '', community: '', category: '', title: '', question: '' })
      setAttachmentFile(null)
      setVideoBlob(null)
      if (recordedVideoRef.current) recordedVideoRef.current.style.display = 'none'
      
    } catch (err: any) {
      if (!video_url && videoBlob) toast.dismiss('video-upload')
      if (!attachment_url && attachmentFile) toast.dismiss('file-upload')
      
      toast.error(err.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(1, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
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
                    
                    {/* Video Recorder UI */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold text-gray-700">Record a Video Question</p>
                        {isRecording && <span className="text-xs font-bold text-red-500 animate-pulse">REC {formatTime(recordTime)}</span>}
                      </div>
                      
                      <video ref={liveVideoRef} className="w-full mb-3 hidden rounded-xl border border-gray-200" autoPlay muted playsInline></video>
                      <video ref={recordedVideoRef} className="w-full mb-3 hidden rounded-xl border border-gray-200" controls></video>

                      <div className="flex flex-wrap gap-2 justify-center">
                        {!isRecording && !videoBlob && (
                          <button type="button" onClick={startRecording} className="px-4 py-2 bg-[#015b2d] text-white text-xs font-bold rounded-xl hover:bg-[#01381d] transition-colors">🎥 Start Recording</button>
                        )}
                        {isRecording && (
                          <button type="button" onClick={stopRecording} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors">⏹ Stop Recording</button>
                        )}
                        {videoBlob && !isRecording && (
                          <button type="button" onClick={redoRecording} className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-300 transition-colors">↻ Redo Recording</button>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Max 1 minute • Max {MAX_FILE_SIZE_MB}MB</p>
                    </div>

                    <div>
                      <label className={labelCls}>Upload Attachment (Optional)</label>
                      <input type="file" onChange={handleFileChange} className={`${inputCls} file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#015b2d] file:text-white hover:file:bg-[#01381d]`} />
                      {attachmentFile && <p className="text-xs text-green-600 mt-1">✓ {attachmentFile.name}</p>}
                    </div>
                    
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
                {['What is your plan for public school funding?', 'How will healthcare reach underserved communities?', 'What support exists for young entrepreneurs?', 'What is the road infrastructure timeline?'].map((q, i) => {
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[#f97316] font-bold text-sm">Q{i + 1}</span>
                      <span className="text-sm text-gray-200">{q}</span>
                    </div>
                  )
                })}
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
        </div>
      </section>
    </>
  )
}