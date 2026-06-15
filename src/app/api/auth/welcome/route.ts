import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mail'
import { signupWelcomeEmail } from '@/lib/email-templates'

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = await req.json()

    await sendMail({
      to: email,
      subject: 'Welcome to the MAI Movement — Registration Confirmed',
      html: signupWelcomeEmail(firstName),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.log('Welcome email error:', err.message)
    return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 })
  }
}