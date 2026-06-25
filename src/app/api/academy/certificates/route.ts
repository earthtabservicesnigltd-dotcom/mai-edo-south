import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = supabaseAdmin()
    const courseId = req.nextUrl.searchParams.get('course_id')

    let query = admin
      .from('academy_certificates')
      .select(`
        certificate_id,
        issued_at,
        course_id,
        academy_courses (
          title,
          certificate_title,
          short_label,
          icon,
          icon_bg,
          icon_color
        )
      `)
      .eq('user_id', user.id)

    if (courseId) query = query.eq('course_id', courseId)

    const { data: certificates, error } = await query.order('issued_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: profile } = await admin
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()

    const recipient_name = `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim()

    return NextResponse.json({
      certificates,
      recipient_name,
      certificate: courseId ? certificates?.[0] ?? null : undefined,
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}