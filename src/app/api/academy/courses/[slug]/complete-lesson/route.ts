import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const sb = await supabaseServer()
    const { data: { user }, error: authError } = await sb.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
    }

    const { data: course } = await supabase
      .from('academy_courses')
      .select('id')
      .eq('slug', slug)
      .single()

    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    const { error } = await supabase
      .from('academy_progress')
      .upsert({
        user_id: user.id,
        course_id: course.id,
        lesson_completed: true,
        lesson_completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}