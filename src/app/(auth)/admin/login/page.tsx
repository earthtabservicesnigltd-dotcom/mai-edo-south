'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'

const PILLARS = [
  { icon: '👥', label: 'Community First Governance' },
  { icon: '📈', label: 'Youth Empowerment & Jobs' },
  { icon: '🛡️', label: 'Transparency & Accountability' },
  { icon: '🏗️', label: 'Infrastructure & Development' },
]

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error('Access Denied', { description: data.error })
      setLoading(false)
      return
    }

    toast.success('Welcome, Admin')
    router.push('/admin')
  }

  return (
    <div className="flex min-h-screen">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-[52%] bg-gradient-to-br from-[#01381d] via-[#015b2d] to-[#024d25] flex-col justify-between px-14 py-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#f97316] opacity-[0.07]" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-white opacity-[0.04]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.06]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-white/[0.06]" />

        <div className="relative z-10">
          <Image src="/image_4.png" alt="MAI Logo" width={70} height={70} className="h-[70px] w-auto" />
          <div className="inline-block mt-3 px-4 py-1 rounded-full text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#f97316] bg-[#f97316]/[0.18] border border-[#f97316]/35">
            Admin Portal
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
          <h2 className="font-heading text-[clamp(38px,4vw,58px)] text-white leading-[1.05] mb-5">
            CAMPAIGN<br /><span className="text-[#f97316]">COMMAND.</span>
          </h2>
          <p className="text-white/65 text-[0.97rem] leading-[1.8] max-w-[380px] mb-9">
            Manage volunteers, track donations, and oversee campaign feedback from one central dashboard.
          </p>
          <div className="flex flex-col gap-3.5">
            {PILLARS.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-[10px] px-4 py-3 max-w-[360px] hover:bg-white/10 transition-colors">
                <div className="w-[34px] h-[34px] bg-[#f97316] rounded-lg flex items-center justify-center text-[15px] shrink-0">
                  {p.icon}
                </div>
                <span className="text-white/80 text-[0.85rem] font-semibold tracking-[0.02em]">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/35 text-[0.75rem] tracking-[0.04em]">
          © 2027 MAI Edo South Campaign. All Rights Reserved.
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-4 bg-gray-50">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Admin Access</CardTitle>
            <CardDescription>Enter your password to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    autoFocus
                    className="field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors text-sm"
                    aria-label="Toggle password"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#01381d] hover:bg-[#015b2d]" disabled={loading}>
                {loading ? 'Verifying...' : 'Access Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}