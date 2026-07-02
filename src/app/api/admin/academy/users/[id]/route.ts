import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const admin = supabaseAdmin()

    const { data: profile } = await admin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { data: enrollments } = await admin
      .from('academy_enrollments')
      .select('*, academy_courses(*)')
      .eq('user_id', id)

    const { data: progress } = await admin
      .from('academy_progress')
      .select('*, academy_courses(title, short_label)')
      .eq('user_id', id)

    const { data: certificates } = await admin
      .from('academy_certificates')
      .select('*, academy_courses(title, short_label)')
      .eq('user_id', id)

    return NextResponse.json({
      profile,
      enrollments: enrollments ?? [],
      progress: progress ?? [],
      certificates: certificates ?? [],
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
