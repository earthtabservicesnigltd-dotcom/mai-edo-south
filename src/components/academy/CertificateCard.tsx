'use client'

import { useRef, useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Image from 'next/image'

export interface CertificateData {
  certificate_id: string
  recipient_name: string
  certificate_title: string
  issued_at: string
  duration: string
}

interface CertificateCardProps {
  cert: CertificateData
  showDownload?: boolean
}

const CERT_WIDTH = 900
const CERT_HEIGHT = 820 // 900 / 1.414

export default function CertificateCard({ cert, showDownload = true }: CertificateCardProps) {
  const certRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function calculateScale() {
      const screenWidth = window.innerWidth - 32 // 16px padding each side
      if (screenWidth < CERT_WIDTH) {
        setScale(screenWidth / CERT_WIDTH)
      } else {
        setScale(1)
      }
    }
    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  const issuedDate = new Date(cert.issued_at).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')
  const verifyUrl = `${siteUrl}/academy/verify/${cert.certificate_id}`


  async function downloadPDF() {
    if (!certRef.current) return
    const html2canvas = (await import('html2canvas-pro')).default
    const jsPDF = (await import('jspdf')).default

    const canvas = await html2canvas(certRef.current, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width / 3, canvas.height / 3],
    })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3)
    pdf.save(`${cert.certificate_id.replace(/\//g, '-')}.pdf`)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Wrapper matched to scaled size */}
      <div
        className="rounded-xl shadow-sm overflow-hidden"
        style={{
          width: CERT_WIDTH * scale,
          height: CERT_HEIGHT * scale,
        }}
      >
        {/* Certificate at full 900px, visually scaled */}
        <div
          ref={certRef}
          style={{
            width: CERT_WIDTH,
            height: CERT_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className="bg-white p-3 font-sans relative"
        >
          {/* Outer Green Border */}
          <div className="w-full h-full border-[4px] border-[#01381d] relative flex flex-col">
            {/* Inner Gold Border */}
            <div className="absolute inset-2 border-[2px] border-[#c9a227] pointer-events-none z-0"></div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-24 h-24 z-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[#01381d] rounded-br-[100%] opacity-90" />
              <div className="absolute top-1.5 left-1.5 w-[72px] h-[72px] bg-[#c9a227] rounded-br-[100%] opacity-80" />
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 z-20">
              <div className="absolute bottom-0 right-0 w-full h-full bg-[#01381d] rounded-tl-[100%] opacity-90" />
              <div className="absolute bottom-1.5 right-1.5 w-[72px] h-[72px] bg-[#c9a227] rounded-tl-[100%] opacity-80" />
            </div>

            <div className="relative z-10 h-full flex flex-col px-12 py-8 text-center">
              {/* Header / Logo */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-1">
                  <Image src="/image_4.png" alt="MAI Academy" width={140} height={36} className="object-contain mb-1" />
                  <h1 className="text-2xl lg:text-4xl font-bold text-[#01381d] mb-6 -ml-4">Academy</h1>
                </div>
                <p className="text-[#01381d] text-[9px] tracking-[0.3em] font-semibold">INSPIRE • REFORM • IMPACT</p>
              </div>

              {/* Title */}
              <div className="mb-4">
                <h1 className="font-serif text-[36px] font-bold text-[#01381d] tracking-wider leading-none">CERTIFICATE OF COMPLETION</h1>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <div className="h-[2px] w-16 bg-[#c9a227]" />
                  <p className="text-[#c9a227] text-[10px] font-bold tracking-[0.4em] uppercase">Professional Excellence</p>
                  <div className="h-[2px] w-16 bg-[#c9a227]" />
                </div>
              </div>

              {/* Recipient */}
              <div className="flex-grow flex flex-col items-center justify-center">
                <p className="text-gray-500 text-[12px] italic mb-2">This is to certify that</p>
                <p
                  className="text-[#01381d] text-3xl font-bold mb-3 pb-1 border-b-2 border-[#c9a227]/50 inline-block min-w-[300px]"
                  style={{ fontFamily: 'var(--font-dancing), cursive' }}
                >
                  {cert.recipient_name}
                </p>
                <p className="text-gray-600 text-[11px] mb-1">
                  has successfully completed the requirements for the award of the
                </p>
                <p className="text-[#01381d] font-bold text-sm mb-1">
                  MAI Academy Professional Certificate in
                </p>
                <p className="text-[#c9a227] font-extrabold text-lg mb-3">
                  {cert.certificate_title}
                </p>
                <p className="text-gray-500 text-[10px] max-w-lg mx-auto leading-relaxed">
                  and has demonstrated dedication to learning, leadership development, civic engagement, and professional excellence.
                </p>
                <p className="text-[#01381d] text-[10px] italic max-w-xl mx-auto mt-2 leading-relaxed">
                  &ldquo;This certificate recognizes the recipient&apos;s commitment to continuous learning, leadership excellence, and service to society through the MAI Academy learning platform.&rdquo;
                </p>
              </div>

              {/* Meta row */}
              <div className="grid grid-cols-3 gap-4 border-t border-[#E5E7EB] pt-3 mt-4 mb-2">
                {[
                  { label: 'Certificate Number', value: cert.certificate_id, icon: 'ti-certificate' },
                  { label: 'Date Issued', value: issuedDate, icon: 'ti-calendar' },
                  { label: 'Duration', value: cert.duration, icon: 'ti-clock' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#01381d] text-[9px] font-bold mb-1">
                      <i className={`ti ${item.icon}`} /> {item.label}
                    </div>
                    <p className="text-[10px] font-semibold text-gray-800 truncate px-1">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Signatures + QR */}
              <div className="flex items-end justify-between mt-4 px-8">
                <div className="text-center w-[200px]">
                  <p className="text-[#01381d] text-md mb-1 whitespace-nowrap" style={{ fontFamily: 'var(--font-dancing), cursive' }}>
                    Mathew A. Iduoriyekemwen
                  </p>
                  <div className="border-t border-gray-400 pt-1">
                    <p className="text-[10px] font-bold text-gray-800">Hon. Mathew Aigbuhenze Iduoriyekemwen</p>
                    <p className="text-[9px] text-[#c9a227] font-semibold">Founder, MAI Academy</p>
                  </div>
                </div>

                <div className="flex flex-col items-center mx-4">
                  <div className="w-16 h-16 rounded-full border-[3px] border-[#c9a227] flex items-center justify-center bg-gradient-to-br from-[#f5e6a3] to-[#c9a227] shadow-md">
                    <div className="text-center">
                      <p className="text-[7px] font-black text-[#01381d] leading-tight">MAI<br />ACADEMY<br />CERTIFIED</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-[#01381d] text-white text-[8px] font-bold px-2 py-1 rounded-t tracking-wider">SCAN TO VERIFY</div>
                  <div className="border-2 border-[#01381d] p-1 bg-white">
                    <QRCodeSVG value={verifyUrl} size={60} fgColor="#01381d" bgColor="#ffffff" />
                  </div>
                  <p className="text-[7px] text-gray-500 mt-1 text-center max-w-[80px] leading-tight">mai4senate.com<br />/academy/verify</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDownload && (
        <button
          onClick={downloadPDF}
          className="bg-[#01381d] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#c9a227] transition-colors"
        >
          Download Certificate (PDF)
        </button>
      )}
    </div>
  )
}