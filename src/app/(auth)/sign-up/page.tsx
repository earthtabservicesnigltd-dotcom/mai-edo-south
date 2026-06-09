"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import React, { FormEvent, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import Image from 'next/image';

const PILLARS = [
  { icon: '👥', label: 'Community First Governance' },
  { icon: '📈', label: 'Youth Empowerment & Jobs' },
  { icon: '🛡️', label: 'Transparency & Accountability' },
  { icon: '🏗️', label: 'Infrastructure & Development' },
];

const LGAS = [
  'Akoko-Edo',
  'Egor',
  'Esan Central',
  'Esan North-East',
  'Esan South-East',
  'Esan West',
  'Etsako Central',
  'Etsako East',
  'Etsako West',
  'Igueben',
  'Ikpoba-Okha',
  'Orhionmwon',
  'Oredo',
  'Ovia North-East',
  'Ovia South-West',
  'Owan East',
  'Owan West',
  'Uhunmwonde',
]


const LeftPanel = () => (
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
);

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    lga: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email.';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    return newErrors;
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    const supabase = supabaseBrowser();

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          lga: form.lga,
        },
      },
    });

    setLoading(false);

    if (error) {
      setServerError(error.message);
      return;
    }

    // Trigger fires automatically — profile row is created in Supabase
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="flex min-h-screen w-full">
        <LeftPanel />
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
          <Card className="w-full max-w-sm text-center">
            <CardContent className="pt-6 space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-heading text-xl text-ink">Check your email</h2>
              <p className="text-sm text-ink-muted leading-relaxed">
                We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.
              </p>
              <Link href="/sign-in" className="text-[#f97316] text-sm hover:underline block mt-4">
                Back to sign in
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <LeftPanel />
      <div className="flex-1 flex flex-col items-center justify-start lg:pt-12 bg-gray-50 overflow-y-auto w-full">
        <div className="w-full px-4 lg:px-12 pb-8 max-w-md">
          <h1 className="border-b-2 w-full text-center p-2 border-[#f97316] font-bold">SIGN UP</h1>
          <h3 className="text-xs text-green pt-6 font-bold">JOIN THE MOVEMENT</h3>
          <h1 className="text-4xl font-semibold pb-4 tracking-tighter">
            STAND <span className="text-[#f97316]">WITH US</span>
          </h1>
          <p className="text-gray-500">Become part of the Edo South 2027 campaign community.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 px-4 w-full lg:px-12 max-w-md pb-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="uppercase text-black/60">First Name</Label>
              <input id="firstName" type="text" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="John" className="field" />
              {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="uppercase text-black/60">Last Name</Label>
              <input id="lastName" type="text" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Doe" className="field" />
              {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="uppercase text-black/60">Email Address</Label>
            <input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="yourname@email.com" className="field" />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="uppercase text-black/60">Phone Number</Label>
            <input id="phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+234 000 0000 000" className="field" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lga" className="uppercase text-black/60">LGA of Residence</Label>
            <select
                id="lga"
                value={form.lga}
                onChange={e => setForm(f => ({ ...f, lga: e.target.value }))}
                className="field"
            >
                <option value="">Select LGA...</option>
                {LGAS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="uppercase text-black/60">Password</Label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Create a strong password" className="field pr-10" />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70 transition-colors" tabIndex={-1}>
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
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
          </div>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <div className="space-y-4 pt-1">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </Button>
            <p className="text-center text-sm text-ink-muted">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-[#f97316] hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;