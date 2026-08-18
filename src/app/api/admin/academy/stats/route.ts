import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const admin = supabaseAdmin()

    const { count: totalUsers, error: uErr } = await admin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    if (uErr) console.error("Stats Error (Users):", uErr.message)

    const { count: activeCourses, error: cErr } = await admin
      .from('academy_courses')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
    if (cErr) console.error("Stats Error (Courses):", cErr.message)

    const { count: totalEnrollments, error: eErr } = await admin
      .from('academy_enrollments')
      .select('*', { count: 'exact', head: true })
    if (eErr) console.error("Stats Error (Enrollments):", eErr.message)

    // ─── FIXED TABLE NAME HERE ───
    // Fetch current certificates from the correct table
    const { count: dbCertificates, error: certErr } = await admin
      .from('academy_school_certificates')
      .select('*', { count: 'exact', head: true })
    if (certErr) console.error("Stats Error (Certificates):", certErr.message)

    // Add the 74 manual certificates from before the DB wipe (27 + 17 + 30)
    const totalCertificates = (dbCertificates ?? 0) + 74

    const { count: passedCourses, error: pErr } = await admin
      .from('academy_progress')
      .select('*', { count: 'exact', head: true })
      .eq('passed', true)
    if (pErr) console.error("Stats Error (Progress):", pErr.message)

    const { data: recentEnrollments, error: rErr } = await admin
      .from('academy_enrollments')
      .select('*, profiles(first_name, last_name, email), academy_courses(title, short_label)')
      .order('enrolled_at', { ascending: false })
      .limit(10)
    if (rErr) console.error("Stats Error (Recent):", rErr.message)

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers ?? 0,
        activeCourses: activeCourses ?? 0,
        totalEnrollments: totalEnrollments ?? 0,
        totalCertificates: totalCertificates,
        passedCourses: passedCourses ?? 0,
      },
      recentEnrollments: recentEnrollments ?? [],
    })
  } catch (error: any) {
    console.error('Academy Stats General Error:', error.message)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}