import Link from 'next/link'
import Image from 'next/image'

export default function EmailConfirmedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-border w-full max-w-md p-10 text-center">

        <Image
          src="/image_4.png"
          alt="MAI Logo"
          width={70}
          height={70}
          className="mx-auto mb-6"
        />

        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-heading text-3xl text-[#01381d] mb-3">
          EMAIL <span className="text-[#f97316]">CONFIRMED!</span>
        </h1>
        <p className="text-ink-muted text-sm leading-relaxed mb-8">
          Your email address has been successfully verified. You are now part of the MAI Edo South movement. Welcome!
        </p>

        <div className="bg-[#01381d]/5 border border-[#01381d]/10 rounded-xl px-6 py-4 mb-8">
          <p className="text-[#01381d] font-black text-sm tracking-widest uppercase">The Time Is <span className="text-[#f97316]">MAI</span></p>
          <p className="text-ink-muted text-xs mt-1">Competence • Capacity • Character</p>
        </div>

        <Link
          href="/login"
          className="inline-block w-full bg-[#01381d] hover:bg-[#015b2d] text-white font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wider"
        >
          Sign In to Your Account
        </Link>

        <p className="text-ink-faint text-xs mt-4">
          © 2027 MAI Edo South Campaign. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}