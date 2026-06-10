import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mail'
import { feedbackAdminEmail, feedbackConfirmationEmail } from '@/lib/email-templates'

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, subject, message } = await req.json()

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const firstName = fullName.split(' ')[0]
    const lastName = fullName.split(' ').slice(1).join(' ')

    await Promise.all([
      // Email to admin
      sendMail({
        to: process.env.ADMIN_EMAIL!,
        subject: `New Contact Message: ${subject}`,
        html: feedbackAdminEmail({
          firstName,
          lastName,
          email,
          phone,
          type: 'message',
          subject,
          message,
        }),
      }),
      // Confirmation to user
      sendMail({
        to: email,
        subject: `We've received your message — MAI Edo South`,
        html: feedbackConfirmationEmail(firstName, 'message'),
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Contact route error:', err.message)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}