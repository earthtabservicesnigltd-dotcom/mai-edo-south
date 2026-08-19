import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendMail } from '@/lib/mail'

export async function POST(req: Request) {
  try {
    const { targetType, schoolSlug, subject, message, sender } = await req.json()
    const admin = supabaseAdmin()
    
    let recipients: { email: string; name: string }[] = []

    if (targetType === 'subscribers') {
      const { data: subs } = await admin
        .from('subscribers')
        .select('email, name')
        .eq('status', 'active')
      
      recipients = (subs || []).map(s => ({ email: s.email, name: s.name || 'Supporter' }))

    } else if (targetType === 'students') {
      let query = admin
        .from('academy_enrollments')
        .select('profiles(email, first_name, last_name), academy_courses!inner(school_slug)')

      if (schoolSlug && schoolSlug !== 'all') {
        query = query.eq('academy_courses.school_slug', schoolSlug)
      }

      const { data: enrollments } = await query

      // Deduplicate emails in case a student is enrolled in multiple courses
      const emailMap = new Map()
      enrollments?.forEach((e: any) => {
        if (e.profiles?.email && !emailMap.has(e.profiles.email)) {
          emailMap.set(e.profiles.email, {
            email: e.profiles.email,
            name: `${e.profiles.first_name || ''} ${e.profiles.last_name || ''}`.trim() || 'Student'
          })
        }
      })
      recipients = Array.from(emailMap.values())
    }

    if (recipients.length === 0) {
      return NextResponse.json({ sent: 0, failed: 0, total: 0, error: 'No recipients found' })
    }

    const senderEmail = sender === 'admin' ? 'admin@mai4senate.com' : 'noreply@mai4senate.com'
    const senderName = 'MAI Edo South Campaign'

    let sent = 0
    let failed = 0

    // Send emails (using Promise.all for speed, but chunk if > 100)
    for (const r of recipients) {
      const personalizedMessage = message.replace(/\[Name\]/g, r.name)
      const html = `<p>Dear ${r.name},</p><p>${personalizedMessage.replace(/\n/g, '<br>')}</p><br><p>Best regards,<br>MAI Edo South Campaign</p>`
      
      try {
        await sendMail({
          to: r.email,
          subject,
          html,
          from: senderEmail
        })
        sent++
      } catch (err) {
        console.error(`Failed to send to ${r.email}:`, err)
        failed++
      }
    }

    return NextResponse.json({ sent, failed, total: recipients.length })
  } catch (error: any) {
    console.error('Broadcast Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}