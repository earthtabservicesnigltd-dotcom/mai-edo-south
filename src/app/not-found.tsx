'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">

      {/* Big 404 */}
      <div className="relative select-none mb-2">
        <p className="font-heading text-[180px] leading-none text-[#01381d]/5 font-black">404</p>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-heading text-6xl text-[#01381d] leading-none">404</p>
          <div className="w-12 h-1 bg-[#f97316] rounded-full mt-3" />
        </div>
      </div>

      {/* Message */}
      <h1 className="font-heading text-2xl text-[#01381d] mt-4 text-center">PAGE NOT FOUND</h1>
      <p className="text-ink-muted text-sm mt-2 text-center max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <Link
          href="/"
          className="bg-[#01381d] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#f97316] transition-colors text-sm uppercase tracking-wider"
        >
          Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="bg-white border border-border text-ink-muted font-bold px-6 py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-sm uppercase tracking-wider"
        >
          Go Back
        </button>
      </div>

    </div>
  )
}