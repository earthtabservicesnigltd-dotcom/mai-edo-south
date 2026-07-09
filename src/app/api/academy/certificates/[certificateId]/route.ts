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
      .from('academy_school_certificates')
      .select(`
        certificate_id,
        issued_at,
        user_id,
        school_slug
      `)
      .eq('certificate_id', dbId)
      .maybeSingle()

    if (error || !cert) {
      return NextResponse.json({ valid: false }, { status: 404 })
    }

    const { data: school } = await admin
      .from('academy_schools')
      .select('title, certificate_title')
      .eq('slug', cert.school_slug)
      .single()

    const { data: profile } = await admin
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', cert.user_id)
      .single()

    return NextResponse.json({
      valid: true,
      certificate: {
        certificate_id: cert.certificate_id,
        recipient_name: `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim(),
        certificate_title: school?.certificate_title ?? '',
        course_title: school?.title ?? cert.school_slug,
        issued_at: cert.issued_at,
        duration: 'One Week',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
