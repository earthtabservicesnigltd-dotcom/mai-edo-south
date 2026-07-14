import { NextResponse } from 'next/server'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = supabaseAdmin()

    // Get user's enrolled school
    const { data: enrollment } = await admin
      .from('academy_enrollments')
      .select('course_id')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (!enrollment) return NextResponse.json({ tasks: [] })

    const { data: course } = await admin
      .from('academy_courses')
      .select('school_slug')
      .eq('id', enrollment.course_id)
      .single()

    // Fetch tasks for that school
    const { data: tasks } = await admin
      .from('academy_tasks')
      .select('*')
      .eq('school_slug', course?.school_slug ?? '')
      .order('created_at')

   return NextResponse.json({ tasks: tasks ?? [], school_slug: course?.school_slug ?? '' })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
