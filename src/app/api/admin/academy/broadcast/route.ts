import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendMail } from '@/lib/mail'

export async function POST(req: NextRequest) {
  try {
    const { schoolSlug, subject, message, sender } = await req.json()
    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 })
    }

    const admin = supabaseAdmin()
    const fromEmail = 'admin@mai4senate.com'

    // Get all enrolled students for the school(s)
    let query = admin
      .from('academy_enrollments')
      .select('user_id, academy_courses!inner(school_slug)')

    if (schoolSlug && schoolSlug !== 'all') {
      query = query.eq('academy_courses.school_slug', schoolSlug)
    }

    const { data: enrollments, error: enrollError } = await query
    if (enrollError) return NextResponse.json({ error: enrollError.message }, { status: 500 })

    const userIds = [...new Set(enrollments?.map(e => e.user_id) ?? [])]

    // Get user emails and names
    const { data: profiles } = await admin
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', userIds)

    const { data: users } = await admin.auth.admin.listUsers()
    const userMap = new Map(users?.users?.map(u => [u.id, u.email]) ?? [])
    const profileMap = new Map(profiles?.map(p => [p.id, p]) ?? [])

    let sent = 0
    let failed = 0

    for (const userId of userIds) {
      const email = userMap.get(userId)
      const profile = profileMap.get(userId)
      if (!email || !profile) { failed++; continue }

      const personalizedHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Dear ${profile.first_name} ${profile.last_name},</p>
          ${message.replace(/\n/g, '<br/>')}
          <br/><br/>
          <p style="color: #6B7280; font-size: 12px;">MAI Academy · Edo South</p>
        </div>
      `

      try {
        await sendMail({
          to: email,
          subject,
          html: personalizedHtml,
          from: fromEmail,
        })
        sent++
      } catch {
        failed++
      }
    }

    return NextResponse.json({ success: true, sent, failed, total: userIds.length })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
