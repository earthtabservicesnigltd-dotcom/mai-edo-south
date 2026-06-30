"use client";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import Image from 'next/image';

const PILLARS = [
  { icon: '👥', label: 'Community First Governance' },
  { icon: '📈', label: 'Youth Empowerment & Jobs' },
  { icon: '🛡️', label: 'Transparency & Accountability' },
  { icon: '🏗️', label: 'Infrastructure & Development' },
];

async function handleGoogleLogin() {
  const supabase = supabaseBrowser();
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
}

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = supabaseBrowser();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If remember me is OFF, clear session on tab close
    if (!rememberMe) {
      await supabase.auth.updateUser({});
    }

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, phone, lga')
      .eq('id', data.user.id)
      .single();

    console.log('Profile:', profile); // remove after confirming

    router.push('/academy');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen w-full">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-[52%] bg-linear-to-br from-[#01381d] via-[#015b2d] to-[#024d25] flex-col justify-between px-14 py-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#f97316] opacity-[0.07]" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-white opacity-[0.04]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.06]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-white/[0.06]" />

        <div className="relative z-10 flex items-center gap-2">
          <Image src="/image_4.png" alt="MAI Logo" width={70} height={70} className="h-[70px] w-auto" />
          <div className="inline px-4 py-2 rounded-full text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#f97316] bg-[#f97316]/[0.18] border border-[#f97316]/35">
            Edo South 2027
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
          <h2 className="font-heading text-[clamp(38px,4vw,58px)] text-white leading-[1.05] mb-5">
            BE PART OF THE<br /><span className="text-[#f97316]">MOVEMENT.</span>
          </h2>
          <p className="text-white/65 text-[0.97rem] leading-[1.8] max-w-[380px] mb-9">
            Register today and join thousands of citizens committed to transforming Edo South through accountable governance, inclusive development, and a senate seat that truly represents the people.
          </p>
          <div className="flex flex-col gap-3.5">
            {PILLARS.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-[10px] px-4 py-3 max-w-[360px] hover:bg-white/10 transition-colors">
                <div className="w-[34px] h-[34px] bg-[#f97316] rounded-lg flex items-center justify-center text-[15px] shrink-0">{p.icon}</div>
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
      <div className="flex-1 flex flex-col items-center justify-start lg:pt-12 bg-gray-50 overflow-y-auto w-full">
        <div className="w-full px-4 lg:px-12 pb-8 max-w-md">
          <h1 className="border-b-2 w-full text-center p-2 border-[#f97316] font-bold">LOG IN</h1>
          <h3 className="text-xs text-green pt-6 font-bold">MEMBER PORTAL</h3>
          <h1 className="text-4xl font-semibold pb-4 tracking-tighter">
            WELCOME <span className="text-[#f97316]">BACK</span>
          </h1>
          <p className="text-gray-500">Login to your campaign account to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 px-4 w-full lg:px-12 max-w-md pb-12">

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="uppercase text-black/60">Email</Label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
              className="field"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="uppercase text-black/60">Password</Label>
              <Link href="/forgot-password" className="text-xs text-[#f97316] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-[#f97316] cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-sm text-black/60 cursor-pointer select-none">
              Remember me
            </label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 border border-black/10 rounded-md px-4 py-2.5 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-black/70"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
            </button>

            <p className="text-center text-sm text-ink-muted">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="text-[#f97316] hover:underline font-medium">Sign up</Link>
            </p>
          </div>

        </form>
      </div>

    </div>
  );
};

export default SignIn;