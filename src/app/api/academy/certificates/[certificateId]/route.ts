import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params
    const dbId = decodeURIComponent(certificateId).replace(/-/g, '/')

    const admin = supabaseAdmin()

    const { data: cert, error } = await admin
      .from('academy_certificates')
      .select(`
        certificate_id,
        issued_at,
        user_id,
        academy_courses (
          title,
          certificate_title,
          short_label
        )
      `)
      .eq('certificate_id', dbId)
      .maybeSingle()

    if (error || !cert) {
      return NextResponse.json({ valid: false }, { status: 404 })
    }

    const { data: profile } = await admin
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', cert.user_id)
      .single()

    type CourseJoin = {
        title: string
        certificate_title: string
        short_label: string
        }

        const courseRaw = cert.academy_courses as CourseJoin | CourseJoin[] | null
        const course = Array.isArray(courseRaw) ? courseRaw[0] : courseRaw

        if (!course) {
        return NextResponse.json({ valid: false }, { status: 404 })
        }

        return NextResponse.json({
        valid: true,
        certificate: {
            certificate_id: cert.certificate_id,
            recipient_name: `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim(),
            certificate_title: course.certificate_title,
            course_title: course.title,
            issued_at: cert.issued_at,
            duration: '1 Day',
        },

    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}