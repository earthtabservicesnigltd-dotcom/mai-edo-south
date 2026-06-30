import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const admin = supabaseAdmin()

    // Get all schools
    const { data: schools, error } = await admin
      .from('academy_schools')
      .select('*')
      .order('title')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Get active courses grouped by school
    const { data: courses } = await admin
      .from('academy_courses')
      .select('id, slug, title, short_label, description, icon, icon_bg, icon_color, certificate_title, school_slug, school_order_index')
      .eq('is_active', true)
      .order('school_order_index')

    // Nest courses inside their school
    const result = schools.map(school => ({
      ...school,
      courses: (courses ?? [])
        .filter(c => c.school_slug === school.slug)
        .map(({ school_slug, school_order_index, ...course }) => course),
    }))

    return NextResponse.json({ schools: result })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
