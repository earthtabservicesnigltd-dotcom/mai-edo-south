'use client'
import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Image from 'next/image'

interface DiasporaData {
  full_name: string
  photo_url?: string
  diaspora_id: string
  country: string
  lga_origin: string
  industry: string
  created_at: string
}

const WorldMap = () => (
  <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full opacity-[0.06]" fill="none">
    <path d="M120,100 C130,80 160,70 180,90 C200,110 195,140 175,150 C155,160 125,150 120,130 Z" fill="#01381d"/>
    <path d="M155,90 C165,75 185,68 200,80 C215,92 218,115 205,125 C192,135 168,130 158,118 Z" fill="#01381d"/>
    <path d="M185,110 C200,95 230,88 250,105 C270,122 268,155 248,165 C228,175 198,165 188,148 Z" fill="#01381d"/>
    <path d="M300,60 C330,40 380,38 410,55 C440,72 445,110 420,128 C395,146 345,142 318,125 C291,108 288,78 300,60 Z" fill="#01381d"/>
    <path d="M360,125 C380,110 415,108 435,125 C455,142 452,175 430,188 C408,201 372,197 355,180 C338,163 342,138 360,125 Z" fill="#01381d"/>
    <path d="M420,55 C450,38 510,35 545,55 C580,75 585,120 558,140 C531,160 468,156 438,136 C408,116 402,78 420,55 Z" fill="#01381d"/>
    <path d="M540,80 C565,60 610,58 638,78 C666,98 668,140 642,158 C616,176 568,170 544,152 C520,134 518,98 540,80 Z" fill="#01381d"/>
    <path d="M620,60 C645,45 685,44 705,62 C725,80 722,115 700,128 C678,141 642,136 624,120 C606,104 608,75 620,60 Z" fill="#01381d"/>
    <path d="M240,170 C260,155 295,152 315,170 C335,188 332,220 310,232 C288,244 255,238 238,222 C221,206 224,183 240,170 Z" fill="#01381d"/>
    <path d="M255,230 C272,215 302,213 320,230 C338,247 336,278 315,290 C294,302 263,296 247,280 C231,264 240,243 255,230 Z" fill="#01381d"/>
    <path d="M380,200 C400,183 438,180 460,198 C482,216 480,252 456,266 C432,280 392,274 373,258 C354,242 362,215 380,200 Z" fill="#01381d"/>
    <path d="M455,175 C480,158 525,155 550,175 C575,195 572,238 545,253 C518,268 470,261 448,244 C426,227 432,190 455,175 Z" fill="#01381d"/>
    <path d="M540,155 C568,138 618,135 645,156 C672,177 670,222 642,238 C614,254 560,247 536,228 C512,209 515,170 540,155 Z" fill="#01381d"/>
    <path d="M640,140 C665,125 705,123 725,142 C745,161 742,198 720,212 C698,226 658,220 640,204 C622,188 618,155 640,140 Z" fill="#01381d"/>
  </svg>
)

export default function DiasporaIDCard({ member }: { member: DiasporaData }) {
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef  = useRef<HTMLDivElement>(null)

  const fullName   = member.full_name.toUpperCase()
  const dateJoined = new Date(member.created_at).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).toUpperCase()
  const verifyUrl  = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${member.diaspora_id.replace(/\//g, '-')}`

  async function downloadCard(ref: React.MutableRefObject<HTMLDivElement | null>, filename: string) {
    if (!ref.current) return
    const html2canvas = (await import('html2canvas-pro')).default
    const jsPDF = (await import('jspdf')).default

    const canvas = await html2canvas(ref.current, {
      scale: 3,
      useCORS: true,
      logging: false,
      onclone: (clonedDoc) => {
        const el = clonedDoc.body
        el.style.setProperty('--color-ink', '#1a1a1a')
        el.style.setProperty('--color-ink-light', '#444444')
        el.style.setProperty('--color-ink-muted', '#767676')
        el.style.setProperty('--color-ink-faint', '#999999')
        el.style.setProperty('--color-green', '#01381d')
        el.style.setProperty('--color-orange', '#f97316')
      },
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width / 3, canvas.height / 3] })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3)
    pdf.save(`${filename}.pdf`)
  }

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-4">
      <div className="text-center">
        <h2 className="font-heading text-3xl">YOUR <span className="text-[#f97316]">ID CARD</span></h2>
        <p className="text-gray-500 text-sm mt-2">Preview your diaspora ID card below.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start justify-center w-full">

        {/* ── FRONT ── */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Front</p>

          <div
            ref={frontRef}
            className="w-[340px] h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white relative font-sans flex flex-col"
          >
            {/* Orange curve top-right */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full bg-[#f97316]/10 pointer-events-none z-0" />
            {/* Green curve bottom-left */}
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-tr-full bg-[#01381d]/10 pointer-events-none z-0" />

            {/* World map watermark */}
            <WorldMap />

            <div className="relative z-10 flex flex-col h-full">

              {/* Header */}
              <div className="bg-[#01381d] px-6 pt-6 pb-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-[#f97316]/20" />
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-white font-black text-3xl leading-none tracking-tight">MAI</p>
                  <div className="w-px h-8 bg-white/30" />
                  <div>
                    <p className="text-white font-black text-base leading-none tracking-widest">DIASPORA</p>
                    <p className="text-[#f97316] font-black text-base leading-none tracking-widest">NETWORK</p>
                  </div>
                </div>
                <p className="text-white/50 text-[9px] tracking-[0.2em] uppercase">Connecting Edo South to the World</p>
              </div>

              {/* Photo */}
              <div className="flex justify-center mt-6 px-6">
                <div className="w-[110px] h-[130px] border-4 border-[#01381d] rounded-2xl overflow-hidden bg-gray-100 shadow-md">
                  {member.photo_url ? (
                    <Image
                      src={member.photo_url}
                      alt="Member"
                      width={110}
                      height={130}
                    className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">👤</div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 px-6 pt-5 space-y-3">
                <div className="border-b border-gray-100 pb-3">
                  <p className="text-[#f97316] text-[9px] font-bold tracking-widest uppercase mb-0.5">Name</p>
                  <p className="font-black text-lg leading-tight text-gray-900">{fullName}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <p className="text-[#f97316] text-[9px] font-bold tracking-widest uppercase mb-0.5">Country of Residence</p>
                  <p className="font-black text-base leading-tight text-gray-900">{member.country.toUpperCase()}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <p className="text-[#f97316] text-[9px] font-bold tracking-widest uppercase mb-0.5">LGA of Origin</p>
                  <p className="font-black text-base leading-tight text-gray-900">{member.lga_origin.toUpperCase()}</p>
                </div>

                {/* Member ID + Date */}
                <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
                  <div>
                    <p className="text-[#f97316] text-[9px] font-bold tracking-widest uppercase mb-0.5">Member ID</p>
                    <p className="font-black text-sm text-[#01381d]">{member.diaspora_id}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div>
                    <p className="text-[#f97316] text-[9px] font-bold tracking-widest uppercase mb-0.5">Date Joined</p>
                    <p className="font-bold text-sm text-gray-900">{dateJoined}</p>
                  </div>
                </div>

                {/* QR + Status */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className="border-2 border-[#f97316] p-1 rounded-lg">
                      <QRCodeSVG value={verifyUrl} size={60} fgColor="#01381d" bgColor="#ffffff" />
                    </div>
                    <p className="text-[7px] text-gray-400 tracking-widest uppercase">Scan to Verify</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400">Status</p>
                    <div className="bg-[#01381d] text-white font-black text-[10px] tracking-widest px-4 py-2 rounded-lg">
                      ACTIVE MEMBER
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => downloadCard(frontRef, `MAI-DIA-Front-${member.diaspora_id.replace(/\//g, '-')}`)}
            className="bg-[#01381d] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#f97316] transition-colors text-sm"
          >
            Download Front
          </button>
        </div>

        {/* ── BACK ── */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Back</p>

          <div
            ref={backRef}
            className="w-[340px] h-[520px] rounded-3xl overflow-hidden shadow-2xl font-sans flex flex-col"
          >
            {/* Top dark green panel */}
            <div className="bg-[#01381d] px-6 py-7 flex flex-col gap-2 relative overflow-hidden flex-1">
              <div className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full bg-[#f97316]/20 pointer-events-none" />
              <div className="absolute top-0 left-0 w-16 h-16 rounded-br-full bg-white/5 pointer-events-none" />

              {/* Logo */}
              <div className="mb-2">
                <p className="text-white font-black text-4xl leading-none tracking-tight">MAI</p>
                <div className="w-8 h-0.5 bg-[#f97316] my-2" />
                <p className="text-white font-black text-lg tracking-widest leading-none">DIASPORA</p>
                <p className="text-white font-black text-lg tracking-widest leading-none">NETWORK</p>
              </div>

              {/* Quote */}
              <div className="mt-2">
                <p className="text-[#f97316] text-2xl font-black leading-none">&apos;</p>
                <p className="text-white/80 text-sm leading-relaxed italic px-2">
                  Though we live across the world, Edo South remains home.
                </p>
                <p className="text-[#f97316] text-2xl font-black leading-none text-right">&apos;</p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/10 my-2" />

              {/* Card disclaimer */}
              <p className="text-white/50 text-[10px] leading-relaxed relative z-10">
                This card identifies the holder as a registered member of the MAI Diaspora Network.
              </p>
            </div>

            {/* Middle white panel */}
            <div className="bg-white px-6 py-5 flex flex-col gap-5">

              {/* Mission */}
              <div>
                <p className="text-[#01381d] font-black text-xs tracking-widest uppercase mb-1">Our Mission</p>
                <div className="w-6 h-0.5 bg-[#f97316] mb-2" />
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  To connect Edo South indigenes across the globe and harness our collective expertise, influence, experience and resources for the development of Edo South.
                </p>
              </div>

              {/* Member Categories */}
              <div>
                <p className="text-[#01381d] font-black text-xs tracking-widest uppercase mb-1">Member Category</p>
                <div className="w-6 h-0.5 bg-[#f97316] mb-2" />
                <div className="space-y-1.5">
                  {[
                    'Diaspora Member',
                    'Diaspora Professional',
                    'Diaspora Investor',
                    'Diaspora Adviser',
                    'Diaspora Ambassador',
                  ].map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-[#f97316]" />
                      <p className="text-gray-700 text-[11px]">{cat}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer bar */}
            <div className="bg-[#01381d] px-6 py-3 flex items-center justify-between">
              <p className="text-white font-black text-[9px] tracking-[0.25em] uppercase">MAI Diaspora Network</p>
              <div className="w-px h-4 bg-white/30" />
              <p className="text-[#f97316] font-black text-[9px] tracking-[0.2em] uppercase">Edo South Beyond Borders</p>
            </div>
          </div>

          <button
            onClick={() => downloadCard(backRef, `MAI-DIA-Back-${member.diaspora_id.replace(/\//g, '-')}`)}
            className="bg-[#01381d] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#f97316] transition-colors text-sm"
          >
            Download Back
          </button>
        </div>
      </div>

      {/* Download Both */}
      <button
        onClick={async () => {
          await downloadCard(frontRef, `MAI-DIA-Front-${member.diaspora_id.replace(/\//g, '-')}`)
          await downloadCard(backRef, `MAI-DIA-Back-${member.diaspora_id.replace(/\//g, '-')}`)
        }}
        className="bg-[#f97316] text-white font-bold px-10 py-3 rounded-xl hover:bg-[#015b2d] transition-colors uppercase tracking-wider"
      >
        Download Both Cards
      </button>
    </div>
  )
}