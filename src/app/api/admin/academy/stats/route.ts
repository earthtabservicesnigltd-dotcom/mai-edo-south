import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const admin = supabaseAdmin()

    const { count: totalUsers } = await admin
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: activeCourses } = await admin
      .from('academy_courses')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const { count: totalEnrollments } = await admin
      .from('academy_enrollments')
      .select('*', { count: 'exact', head: true })

    const { count: totalCertificates } = await admin
      .from('academy_certificates')
      .select('*', { count: 'exact', head: true })

    const { count: passedCourses } = await admin
      .from('academy_progress')
      .select('*', { count: 'exact', head: true })
      .eq('passed', true)

    const { data: recentEnrollments } = await admin
      .from('academy_enrollments')
      .select('*, profiles(first_name, last_name, email), academy_courses(title, short_label)')
      .order('enrolled_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers ?? 0,
        activeCourses: activeCourses ?? 0,
        totalEnrollments: totalEnrollments ?? 0,
        totalCertificates: totalCertificates ?? 0,
        passedCourses: passedCourses ?? 0,
      },
      recentEnrollments: recentEnrollments ?? [],
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
