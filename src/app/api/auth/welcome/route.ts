import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mail'
import { academyWelcomeEmail } from '@/lib/email-templates'

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, courseTitle } = await req.json()

    await sendMail({
      to: email,
      subject: 'Welcome to MAI Academy — Start Your Learning Journey!',
      html: academyWelcomeEmail(firstName, courseTitle),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.log('Welcome email error:', err.message)
    return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 })
  }
}
