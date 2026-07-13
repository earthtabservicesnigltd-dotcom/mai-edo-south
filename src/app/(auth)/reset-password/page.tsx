'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser().auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    // Also check if we already have a session
    supabaseBrowser().auth.getUser().then(({ data }) => {
      if (data?.user) setReady(true)
    })
  }, [])

  async function handleReset() {
    if (!password || password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    const { error } = await supabaseBrowser().auth.updateUser({ password })
    setLoading(false)
    if (error) toast.error(error.message)
    else {
      toast.success('Password updated! Sign in with your new password.')
      await supabaseBrowser().auth.signOut()
      router.push('/academic-auth')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa] px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-sm">
        <h1 className="font-[Syne] text-2xl font-bold text-[#111827] mb-2">Set New Password</h1>
        <p className="text-[#6B7280] text-sm mb-6">Enter your new password below.</p>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-sm outline-none focus:border-[#015b2d] mb-4"
          placeholder="New password" disabled={!ready} />
        <button onClick={handleReset} disabled={loading || !ready}
          className="w-full bg-[#01381d] text-white font-bold py-3 rounded-xl hover:bg-[#015b2d] transition-colors text-sm disabled:opacity-60">
          {!ready ? 'Checking link...' : loading ? 'Updating...' : 'Reset Password'}
        </button>
      </div>
    </div>
  )
}
