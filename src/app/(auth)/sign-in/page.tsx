"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react'
import {supabaseBrowser} from '@/lib/supabase';

const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const supabase = supabaseBrowser();
        const {error} = await supabase.auth.signInWithPassword({email, password});

        if(error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push('/');
        router.refresh();
    }
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4'>
        <div className="mb-8">
            {/* <Link href='/'>
                <PinnacleLogo variant='default' height={44}/>
            </Link> */}
        </div>

        <Card className='w-full max-w-sm'>
            <CardHeader>
                <CardTitle className='font-serif text-xl'>Sign in</CardTitle>
                <CardDescription>Welcome back to Pinnacle Newspaper</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className='space-y-4'>
                   <div className="space-y-1.5">
                     <Label htmlFor='email'>Email</Label>
                    <Input id='email' type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='you@example.com' required autoFocus/>
                   </div>

                   <div className="space-y-1 5">
                    <Label htmlFor='password'>Password</Label>
                    <Input id='password' type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='' required/>
                   </div>

                   {error && <p className='text-sm text-destructive'>{error}</p>}

                   <Button type='submit' className='w-full' disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>

                   <p className="text-center text-sm text-ink-muted">
                    Don&apos;t have an account?
                    <Link href='/sign-up' className='text-brand hover:underline font-medium'>Sign up</Link>
                   </p>

                   <p className="text-center text-sm">
                    <Link href='/forgot-password' className='text-ink-muted hover:text-brand transition-colors text-xs'>Forgot your password?</Link>
                   </p>
                </form>
            </CardContent>
        </Card>
      
    </div>
  )
}

export default SignIn
