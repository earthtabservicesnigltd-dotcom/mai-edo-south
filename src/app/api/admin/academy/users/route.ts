// @ts-nocheck
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const admin = supabaseAdmin()
    
    // Get profiles separately
    const { data: profiles, error } = await admin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 } as any)

    // Get enrollments, progress, certificates separately
    const { data: enrollments } = await admin
      .from('academy_enrollments')
      .select('*, academy_courses(title, short_label)')

    const { data: progress } = await admin
      .from('academy_progress')
      .select('*, academy_courses(title, short_label)')

    const { data: certificates } = await admin
      .from('academy_certificates')
      .select('*, academy_courses(title, short_label)')

    // Attach data to each profile
    const users = (profiles ?? []).map(profile => ({
      ...profile,
      academy_enrollments: (enrollments ?? []).filter(e => e.user_id === profile.id),
      academy_progress: (progress ?? []).filter(p => p.user_id === profile.id),
      academy_certificates: (certificates ?? []).filter(c => c.user_id === profile.id),
    }))

    return NextResponse.json({ users: users ?? [] })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 } as any)
  }
}
