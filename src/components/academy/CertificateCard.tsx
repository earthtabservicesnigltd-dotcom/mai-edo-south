'use client'

import { useRef } from 'react'
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
  showDownload?: boolean   // ← add this line
}

export default function CertificateCard({ cert, showDownload=true }: CertificateCardProps) {
  const certRef = useRef<HTMLDivElement>(null)

  const issuedDate = new Date(cert.issued_at).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/academy/verify/${cert.certificate_id.replace(/\//g, '-')}`

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
    <div className="flex flex-col items-center gap-6">
      {/* Landscape certificate — ~ A4 landscape ratio */}
      <div
        ref={certRef}
        className="relative w-[900px] max-w-full aspect-[1.414/1] bg-white border-[3px] border-[#01381d] overflow-hidden font-sans"
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32">
          <div className="absolute top-0 left-0 w-full h-full bg-[#01381d] rounded-br-[100%] opacity-90" />
          <div className="absolute top-2 left-2 w-24 h-24 bg-[#f97316] rounded-br-[100%] opacity-80" />
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32">
          <div className="absolute bottom-0 right-0 w-full h-full bg-[#01381d] rounded-tl-[100%] opacity-90" />
          <div className="absolute bottom-2 right-2 w-24 h-24 bg-[#f97316] rounded-tl-[100%] opacity-80" />
        </div>

        <div className="relative z-10 h-full flex flex-col px-12 py-8">
          {/* Header / Logo */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Image src="/mai-academy-logo.png" alt="MAI Academy" width={180} height={48} className="object-contain" />
            </div>
            <p className="text-[#01381d] text-[10px] tracking-[0.25em] font-medium">Inspire • Reform • Impact</p>
          </div>

          {/* Title */}
          <div className="text-center mb-5">
            <h1 className="font-serif text-[42px] font-bold text-[#01381d] tracking-wide leading-none">CERTIFICATE</h1>
            <div className="flex items-center justify-center gap-3 mt-2">
              <div className="h-px w-16 bg-[#f97316]" />
              <p className="text-[#f97316] text-sm font-bold tracking-[0.3em] uppercase">Of Completion</p>
              <div className="h-px w-16 bg-[#f97316]" />
            </div>
            <p className="text-gray-600 text-sm mt-4 italic">This is to certify that</p>
          </div>

          {/* Recipient */}
          <div className="text-center flex-1">
            <p
              className="text-[#01381d] text-3xl font-bold mb-4 pb-2 border-b-2 border-[#f97316]/40 inline-block min-w-[320px]"
              style={{ fontFamily: 'var(--font-dancing), cursive' }}
            >
              {cert.recipient_name}
            </p>

            <p className="text-gray-600 text-sm mb-2">
              has successfully completed the requirements for the award of the
            </p>

            <p className="text-[#01381d] font-bold text-base mb-1">
              MAI Academy Professional Certificate in
            </p>
            <p className="text-[#f97316] font-extrabold text-xl mb-3">
              {cert.certificate_title}
            </p>

            <p className="text-gray-500 text-xs max-w-lg mx-auto leading-relaxed">
              and has demonstrated dedication to learning, leadership development,
              civic engagement, and professional excellence.
            </p>

            <p className="text-[#01381d] text-xs italic max-w-xl mx-auto mt-4 leading-relaxed">
              &ldquo;This certificate recognizes the recipient&apos;s commitment to continuous learning,
              leadership excellence, and service to society through the MAI Academy learning platform.&rdquo;
            </p>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-3 gap-4 border-t border-[#E5E7EB] pt-4 mb-4">
            {[
              { label: 'Certificate Number', value: cert.certificate_id, icon: 'ti-certificate' },
              { label: 'Date Issued', value: issuedDate, icon: 'ti-calendar' },
              { label: 'Duration', value: cert.duration, icon: 'ti-clock' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-1 text-[#01381d] text-[10px] font-bold mb-1">
                  <i className={`ti ${item.icon}`} /> {item.label}
                </div>
                <p className="text-sm font-semibold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Signatures + QR */}
          <div className="flex items-end justify-between">
            <div className="text-center w-[200px]">
              <p className="text-[#01381d] text-lg mb-0" style={{ fontFamily: 'var(--font-dancing), cursive' }}>
                Alhimfocerafo
              </p>
              <div className="border-t border-gray-400 pt-1">
                <p className="text-[10px] font-bold text-gray-800">Hon. Mathew Aigbuhenze Iduoriyekemwen</p>
                <p className="text-[9px] text-[#f97316] font-semibold">Founder, MAI Academy</p>
              </div>
            </div>

            {/* Gold seal */}
            <div className="w-20 h-20 rounded-full border-4 border-[#c9a227] flex items-center justify-center bg-gradient-to-br from-[#f5e6a3] to-[#c9a227] shadow-md">
              <div className="text-center">
                <p className="text-[7px] font-black text-[#01381d] leading-tight">MAI<br />ACADEMY<br />CERTIFIED</p>
              </div>
            </div>

            <div className="text-center w-[200px]">
              <p className="text-[#01381d] text-lg mb-0 h-6" style={{ fontFamily: 'var(--font-dancing), cursive' }}>
                {/* Academy Director signature */}
              </p>
              <div className="border-t border-gray-400 pt-1">
                <p className="text-[10px] font-bold text-gray-800">Academy Director</p>
                <p className="text-[9px] text-[#f97316] font-semibold">MAI Academy</p>
              </div>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center">
              <div className="bg-[#01381d] text-white text-[8px] font-bold px-2 py-0.5 rounded-t tracking-wider">
                SCAN TO VERIFY
              </div>
              <div className="border-2 border-[#01381d] p-1 bg-white">
                <QRCodeSVG value={verifyUrl} size={72} fgColor="#01381d" bgColor="#ffffff" />
              </div>
              <p className="text-[7px] text-gray-500 mt-1 text-center max-w-[90px] leading-tight">
                OR VISIT:<br />mai4senate.com/academy/verify
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[8px] text-[#f97316] mt-3">
            • All MAI Academy certificates can be verified online at www.mai4senate.com/academy/verify •
          </p>
        </div>
      </div>

      {showDownload && (
        <button
          onClick={downloadPDF}
          className="bg-[#01381d] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#f97316] transition-colors"
        >
          Download Certificate (PDF)
        </button>
      )}
    </div>
  )
}