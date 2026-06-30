import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password, courseSlug } = await req.json()

    if (!firstName || !lastName || !email || !password || !courseSlug) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const admin = supabaseAdmin()

    // ── Look up the course first (fail fast before creating a user) ──
    const { data: course } = await admin
      .from('academy_courses')
      .select('id, school_slug, school_order_index')
      .eq('slug', courseSlug)
      .single()

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // ── Create the auth user ──
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName },
    })

    if (createError || !created?.user) {
      return NextResponse.json(
        { error: createError?.message || 'Could not create account.' },
        { status: 400 }
      )
    }

    const userId = created.user.id

    // ── LOCK CHECK 1: Previous course in same school ──
    // (Not really applicable for a brand-new user, but kept for consistency
    // in case this endpoint is ever reused for existing users.)
    if (course.school_order_index > 1) {
      const { data: prevCourse } = await admin
        .from('academy_courses')
        .select('id')
        .eq('school_slug', course.school_slug)
        .eq('school_order_index', course.school_order_index - 1)
        .single()

      if (prevCourse) {
        const { data: prevProgress } = await admin
          .from('academy_progress')
          .select('passed')
          .eq('user_id', userId)
          .eq('course_id', prevCourse.id)
          .single()

        if (!prevProgress?.passed) {
          // Roll back the created user so we don't leave orphaned accounts
          await admin.auth.admin.deleteUser(userId)
          return NextResponse.json(
            { error: 'Complete the previous course in this school first.' },
            { status: 403 }
          )
        }
      }
    }

    // ── Enroll ──
    const { error: enrollError } = await admin
      .from('academy_enrollments')
      .upsert({ user_id: userId, course_id: course.id }, { onConflict: 'user_id,course_id' })

    if (enrollError) {
      await admin.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: enrollError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}