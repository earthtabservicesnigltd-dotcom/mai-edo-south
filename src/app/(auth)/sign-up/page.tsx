"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabaseBrowser } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const SignUp = () => {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    async function handleSignup(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        if(password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const supabase = supabaseBrowser();
        const {error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {first_name: firstName, last_name: lastName},
            },
        });

        if(error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // Show confirmation message - Supabase sends a verification email
        setConfirmed(true);
        setLoading(false);
    }

    if(confirmed) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
                <div className="mb-8">
                    {/* <Link href='/'>
                        <PinnacleLogo variant="default" height={44}/>
                    </Link> */}
                </div>
                <Card className="w-full max-w-sm text-center">
                    <CardContent className="pt-6 space-y-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <h2 className="font-serif text-xl font-bold text-ink">Check your email</h2>
                        <p className="text-sm text-ink-muted leading-relaxed">
                            We sent a confirmation link to <strong>{email}</strong>.
                            Click it to activate your account.
                        </p>
                        <Link href='/sign-in' className="text-brand text-sm hover:underline block mt-4">Back to sign in</Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="mb-8">
            {/* <Link href='/'>
                <PinnacleLogo variant="default" height={44}/>
            </Link> */}
        </div>

        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="font-serif text-xl">Create an Account</CardTitle>
                <CardDescription>Join Pinnacle Newspaper as a reader</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-1 5">
                        <Label htmlFor="fullName">First name</Label>
                        <Input id="fullName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Osama" required autoFocus className="field"/>
                    </div>
                    <div className="space-y-1 5">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="fullName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Omoregbe" required autoFocus className="field"/>
                    </div>

                    <div className="space-y-1 5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="field"/>
                    </div>

                    <div className="space-y-1 5">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required minLength={8} className="field"/>
                    </div>

                     <div className="space-y-1 5">
                        <Label htmlFor="password">Confirm Password</Label>
                        <Input id="confirm_password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="field"/>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</Button>

                    <p className="text-center text-xs text-ink-faint leading-relaxed">
                        Already have an account?
                        <Link href='/sign-in' className="hover:underline">Sign In</Link>          
                    </p>
                </form>
            </CardContent>
        </Card>     
    </div>
  )
}

export default SignUp
