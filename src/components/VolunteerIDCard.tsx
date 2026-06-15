'use client'
import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Image from 'next/image'

interface VolunteerData {
  first_name: string
  last_name: string
  photo_url: string
  volunteer_id: string
  lga: string
  ward: string
  phone: string
  volunteer_areas: string[]
  created_at: string
}

export default function VolunteerIDCard({ volunteer }: { volunteer: VolunteerData }) {
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef  = useRef<HTMLDivElement>(null)

  const fullName       = `${volunteer.first_name} ${volunteer.last_name}`.toUpperCase()
  const areaOfService  = volunteer.volunteer_areas?.[0]?.toUpperCase() ?? 'GENERAL'
  const dateRegistered = new Date(volunteer.created_at).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).toUpperCase()
  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${volunteer.volunteer_id.replace(/\//g, '-')}`

async function downloadCard(ref: React.MutableRefObject<HTMLDivElement | null>, filename: string) {
  if (!ref.current) return
  const html2canvas = (await import('html2canvas-pro')).default
  const jsPDF = (await import('jspdf')).default

  const canvas = await html2canvas(ref.current, {
    scale: 3,
    useCORS: true,
    logging: false,
    onclone: (clonedDoc) => {
      // Replace oklch/lab colors with hex equivalents on the cloned element
      const el = clonedDoc.body
      el.style.setProperty('--color-ink', '#1a1a1a')
      el.style.setProperty('--color-ink-light', '#444444')
      el.style.setProperty('--color-ink-muted', '#767676')
      el.style.setProperty('--color-ink-faint', '#999999')
      el.style.setProperty('--color-navy', '#1B2D5E')
      el.style.setProperty('--color-navy-light', '#2a4080')
    },
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width / 3, canvas.height / 3] })
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3)
  pdf.save(`${filename}.pdf`)
}
  return (
    <div className="flex flex-col items-center gap-8 py-8 px-4">
      <h2 className="font-heading text-3xl text-center">YOUR <span className="text-[#f97316]">ID CARD</span></h2>
      <p className="text-gray-500 text-sm text-center -mt-4">Preview your volunteer ID card below. Download front and back separately.</p>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full">

        {/* ── FRONT ── */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Front</p>

          <div ref={frontRef} className="w-[340px] min-h-[520px] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white relative font-sans">

            {/* Header */}
            <div className="bg-[#01381d] px-4 py-3 flex items-center gap-3">
              <Image src="/image-3.jpg" alt="ADC" width={48} height={48} className="object-contain rounded" />
              <div className="w-px h-10 bg-white/30" />
              <div className="flex items-center gap-2">
                <Image src="/image_4.png" alt="MAI" width={40} height={40} className="object-contain" />
                <div>
                  <p className="text-white font-black text-xl leading-none tracking-tight">MAI</p>
                  <p className="text-white text-[9px] leading-tight font-semibold">SENATORIAL CAMPAIGN<br />ORGANIZATION</p>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div className="bg-white px-4 py-2 border-b border-gray-100">
              <p className="text-[#01381d] font-black text-sm tracking-wide">THE TIME IS <span className="text-[#f97316]">MAI</span></p>
              <p className="text-gray-400 text-[9px] tracking-[0.15em]">COMPETENCE • CAPACITY • CHARACTER</p>
            </div>

            {/* ID Card Label */}
            <div className="bg-[#01381d] px-4 py-2 flex items-center justify-between">
              <p className="text-white font-black text-sm tracking-widest">VOLUNTEER ID CARD</p>
              <div className="flex gap-1">
                <div className="w-3 h-5 bg-[#f97316] skew-x-[-10deg]" />
                <div className="w-3 h-5 bg-[#f97316] skew-x-[-10deg]" />
              </div>
            </div>

            {/* Body */}
            <div className="px-4 pt-4 pb-2 flex gap-4 relative">
              <div className="absolute right-2 top-2 opacity-[0.06]">
                <Image src="/image_4.png" alt="" width={128} height={128} className="object-contain" />
              </div>

              {/* Photo */}
              <div className="shrink-0">
                <div className="w-[100px] h-[120px] border-2 border-[#01381d] rounded overflow-hidden bg-gray-100">
                  {volunteer.photo_url ? (
                    <Image src={volunteer.photo_url} alt="Volunteer" width={100} height={120} className="w-full h-full object-cover" crossOrigin="anonymous" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">👤</div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-[#01381d] text-[9px] font-bold tracking-widest">NAME:</p>
                  <p className="font-black text-sm leading-tight text-gray-900">{fullName}</p>
                </div>
                <div>
                  <p className="text-[#01381d] text-[9px] font-bold tracking-widest">VOLUNTEER ID:</p>
                  <p className="font-black text-sm text-[#f97316]">{volunteer.volunteer_id}</p>
                </div>
                <div>
                  <p className="text-[#01381d] text-[9px] font-bold tracking-widest">LGA:</p>
                  <p className="font-bold text-sm text-gray-900">{volunteer.lga.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-[#01381d] text-[9px] font-bold tracking-widest">WARD:</p>
                  <p className="font-bold text-sm text-gray-900">{volunteer.ward.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Bottom info + QR */}
            <div className="px-4 pb-2 flex justify-between items-end">
              <div className="space-y-1.5">
                <div>
                  <p className="text-[#01381d] text-[9px] font-bold tracking-widest">AREA OF SERVICE:</p>
                  <p className="font-bold text-xs text-gray-900">{areaOfService}</p>
                </div>
                <div>
                  <p className="text-[#01381d] text-[9px] font-bold tracking-widest">PHONE:</p>
                  <p className="font-bold text-xs text-gray-900">{volunteer.phone}</p>
                </div>
                <div>
                  <p className="text-[#01381d] text-[9px] font-bold tracking-widest">DATE REGISTERED:</p>
                  <p className="font-bold text-xs text-gray-900">{dateRegistered}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="border-2 border-[#01381d] p-1 rounded">
                  <QRCodeSVG value={verifyUrl} size={72} fgColor="#01381d" bgColor="#ffffff" />
                </div>
                <p className="text-[8px] text-gray-400 tracking-widest">SCAN TO VERIFY</p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#01381d] px-4 py-3 mt-2">
              <p className="text-white text-center mb-0.5" style={{ fontFamily: 'var(--font-dancing), cursive', fontSize: '22px' }}>
                Alhimfocerafo
              </p>
              <p className="text-white font-black text-[10px] text-center tracking-wide">HON. MATHEW AIGBUHENZE IDUORIYEKEMWEN</p>
              <p className="text-[#f97316] text-[9px] text-center font-bold tracking-widest">SENATORIAL CANDIDATE, EDO SOUTH</p>
            </div>
          </div>

          <button
            onClick={() => downloadCard(frontRef, `MAI-ID-Front-${volunteer.volunteer_id.replace(/\//g, '-')}`)}
            className="bg-[#01381d] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#f97316] transition-colors text-sm"
          >
            Download Front
          </button>
        </div>

        {/* ── BACK ── */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Back</p>

          <div ref={backRef} className="w-[340px] min-h-[520px] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white font-sans flex flex-col">

            {/* Header */}
            <div className="bg-[#01381d] px-5 py-4">
              <p className="text-white font-black text-lg leading-tight">
                <span className="text-[#f97316]">MAI</span> SENATORIAL CAMPAIGN ORGANIZATION
              </p>
              <p className="text-white/70 text-xs font-semibold tracking-widest mt-1">THE TIME IS <span className="text-[#f97316]">MAI</span></p>
              <div className="flex gap-1 mt-2">
                <div className="w-4 h-1.5 bg-[#f97316]" />
                <div className="w-4 h-1.5 bg-[#f97316]" />
                <div className="w-4 h-1.5 bg-[#f97316]" />
              </div>
            </div>

            {/* About */}
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-[#01381d] font-black text-sm tracking-wide mb-2">ABOUT US</p>
              <p className="text-gray-600 text-xs leading-relaxed">
                We are a people-driven movement committed to electing{' '}
                <strong>Hon. Mathew Aigbuhenze Iduoriyekemwen</strong> as Senator representing Edo South Senatorial District.
              </p>
            </div>

            {/* Code of Conduct */}
            <div className="px-5 py-4 flex-1">
              <p className="text-[#01381d] font-black text-sm tracking-wide mb-3">VOLUNTEER CODE OF CONDUCT</p>
              <div className="space-y-2">
                {[
                  'I will promote peace, unity and respect for all.',
                  'I will abide by the rules and directives of the campaign organization.',
                  'I will not engage in any act that brings the campaign or the organization into disrepute.',
                  'I will work with integrity, loyalty and responsibility.',
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#01381d] flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-5 border-t-2 border-[#f97316]/40" />

            {/* Return info */}
            <div className="px-5 py-4">
              <p className="text-gray-500 text-[10px] text-center font-semibold mb-1">THIS ID CARD IS THE PROPERTY OF</p>
              <p className="text-[#01381d] font-black text-xs text-center mb-3">MAI SENATORIAL CAMPAIGN ORGANIZATION.</p>
              <p className="text-[#f97316] font-black text-[10px] text-center tracking-wide mb-2">IF FOUND, PLEASE RETURN TO:</p>
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <span className="text-[#01381d] text-xs">📍</span>
                  <p className="text-gray-600 text-xs">55, Second East Circular Road, Benin City, Edo State, Nigeria.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#01381d] text-xs">📞</span>
                  <p className="text-gray-600 text-xs">0806 970 1080</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#01381d] px-5 py-3 flex items-center justify-between">
              <p className="text-white text-[9px] font-bold tracking-widest">NOT TRANSFERABLE</p>
              <div className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
              <p className="text-white text-[9px] font-bold tracking-widest">VALID FOR 2027 CAMPAIGN</p>
            </div>
          </div>

          <button
            onClick={() => downloadCard(backRef, `MAI-ID-Back-${volunteer.volunteer_id.replace(/\//g, '-')}`)}
            className="bg-[#01381d] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#f97316] transition-colors text-sm"
          >
            Download Back
          </button>
        </div>
      </div>

      {/* Download Both */}
      <button
        onClick={async () => {
          await downloadCard(frontRef, `MAI-ID-Front-${volunteer.volunteer_id.replace(/\//g, '-')}`)
          await downloadCard(backRef, `MAI-ID-Back-${volunteer.volunteer_id.replace(/\//g, '-')}`)
        }}
        className="bg-[#f97316] text-white font-bold px-10 py-3 rounded-xl hover:bg-[#015b2d] transition-colors uppercase tracking-wider"
      >
        Download Both Cards
      </button>
    </div>
  )
}