import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { schoolSlug } = await req.json()
    if (!schoolSlug) return NextResponse.json({ error: 'schoolSlug required' }, { status: 400 })

    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = supabaseAdmin()

    // Check if certificate already exists
    const { data: existing } = await admin
      .from('academy_school_certificates')
      .select('certificate_id, issued_at')
      .eq('user_id', user.id)
      .eq('school_slug', schoolSlug)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ certificate_id: existing.certificate_id, issued_at: existing.issued_at })
    }

    // Verify all courses are passed
    const { data: school } = await admin
      .from('academy_schools')
      .select('title, certificate_title')
      .eq('slug', schoolSlug)
      .single()

    const { data: courses } = await admin
      .from('academy_courses')
      .select('id')
      .eq('school_slug', schoolSlug)
      .eq('is_active', true)

    const courseIds = courses?.map(c => c.id) ?? []
    if (courseIds.length === 0) return NextResponse.json({ error: 'No courses found' }, { status: 404 })

    const { data: progress } = await admin
      .from('academy_progress')
      .select('course_id, passed')
      .eq('user_id', user.id)
      .in('course_id', courseIds)

    const passedCount = progress?.filter(p => p.passed).length ?? 0
    if (passedCount < courseIds.length) {
      return NextResponse.json({ error: 'Not all courses completed' }, { status: 400 })
    }

    // Generate stable certificate ID
    const certId = `MAI-${schoolSlug}-${user.id.slice(0, 8)}`

    // Save to DB
    const { data: inserted, error } = await admin
      .from('academy_school_certificates')
      .insert({
        certificate_id: certId,
        user_id: user.id,
        school_slug: schoolSlug,
        issued_at: new Date().toISOString(),
      })
      .select('certificate_id, issued_at')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ certificate_id: inserted.certificate_id, issued_at: inserted.issued_at })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
