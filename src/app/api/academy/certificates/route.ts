import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = supabaseAdmin()
    const schoolSlug = req.nextUrl.searchParams.get('school_slug')

    let query = admin
      .from('academy_school_certificates')
      .select(`
        certificate_id,
        issued_at,
        school_slug,
        user_id
      `)
      .eq('user_id', user.id)

    if (schoolSlug) query = query.eq('school_slug', schoolSlug)

    const { data: certificates, error } = await query.order('issued_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Fetch school details for each certificate
    const schoolSlugs = [...new Set(certificates?.map(c => c.school_slug) ?? [])]
    const { data: schools } = await admin
      .from('academy_schools')
      .select('slug, title, certificate_title, icon, icon_bg, icon_color')
      .in('slug', schoolSlugs)

    const schoolMap = new Map(schools?.map(s => [s.slug, s]) ?? [])

    const enriched = (certificates ?? []).map(cert => {
      const school = schoolMap.get(cert.school_slug)
      return {
        certificate_id: cert.certificate_id,
        issued_at: cert.issued_at,
        school_slug: cert.school_slug,
        school_title: school?.title ?? cert.school_slug,
        certificate_title: school?.certificate_title ?? '',
        icon: school?.icon,
        icon_bg: school?.icon_bg,
        icon_color: school?.icon_color,
      }
    })

    const { data: profile } = await admin
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()

    const recipient_name = `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim()

    return NextResponse.json({
      certificates: enriched,
      recipient_name,
      certificate: schoolSlug ? enriched?.[0] ?? null : undefined,
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
