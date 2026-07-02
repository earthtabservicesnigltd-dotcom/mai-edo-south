'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'

export default function AuthRedirectHandler() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const supabase = supabaseBrowser()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && (pathname === '/confirm' || pathname === '/auth/callback' || pathname === '/')) {
        router.push('/academy')
      }
    })
  }, [pathname])

  return null
}
