'use client'

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { toast } from 'sonner'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return toast.error('Enter your email address')
    setLoading(true)
    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, {
     redirectTo: `${window.location.origin}/reset-password`,  // was /academy/reset-password
    })
    setLoading(false)
    if (error) toast.error(error.message)
    else setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa] px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-green-600" size={28} />
          </div>
          <h1 className="font-[Syne] text-2xl font-bold text-[#111827] mb-2">Check Your Email</h1>
          <p className="text-[#6B7280] text-sm mb-6">
            We&apos;ve sent a password reset link to <strong>{email}</strong>
          </p>
          <Link href="/academic-auth" className="text-[#f97316] text-sm font-semibold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa] px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-sm">
        <Link href="/academic-auth" className="inline-flex items-center gap-1 text-[#6B7280] text-sm mb-6 hover:text-[#111827]">
          <ArrowLeft size={16} /> Back to Sign In
        </Link>
        <h1 className="font-[Syne] text-2xl font-bold text-[#111827] mb-2">Forgot Password?</h1>
        <p className="text-[#6B7280] text-sm mb-6">Enter your email and we&apos;ll send you a reset link.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#374151] uppercase mb-2 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-sm outline-none focus:border-[#015b2d]"
              placeholder="your@email.com" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#01381d] text-white font-bold py-3 rounded-xl hover:bg-[#015b2d] transition-colors text-sm disabled:opacity-60">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  )
}
