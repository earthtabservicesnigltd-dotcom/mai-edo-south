import { supabaseAdmin, supabaseServer } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    const admin = supabaseAdmin()

    const { data: course, error } = await admin
      .from('academy_courses')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    let enrollment = null
    let progress = null
    let locked = { locked: false, reason: '' }

    if (user) {
      const { data: enrollData } = await admin
        .from('academy_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single()
      enrollment = enrollData

      const { data: progressData } = await admin
        .from('academy_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single()
      progress = progressData

      // ── LOCK CHECK 1: Previous course in same school ──
      if (course.school_slug && course.school_order_index > 1) {
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
            .eq('user_id', user.id)
            .eq('course_id', prevCourse.id)
            .single()

          if (!prevProgress?.passed) {
            locked = { locked: true, reason: 'Complete the previous course in this school first.' }
          }
        }
      }

      // ── LOCK CHECK 2: Cross-school lock ──
      if (course.school_slug && !locked.locked) {
        // Check if user has enrollments in a DIFFERENT school
        const { data: userEnrollments } = await admin
          .from('academy_enrollments')
          .select('course_id')
          .eq('user_id', user.id)

        if (userEnrollments && userEnrollments.length > 0) {
          const enrolledCourseIds = userEnrollments.map(e => e.course_id)

          const { data: enrolledCourses } = await admin
            .from('academy_courses')
            .select('id, school_slug')
            .in('id', enrolledCourseIds)

          const otherSchoolSlugs = [...new Set(
            (enrolledCourses ?? [])
              .filter(c => c.school_slug !== course.school_slug)
              .map(c => c.school_slug)
          )]

          // If they're enrolled in another school, check if it's complete
          for (const otherSlug of otherSchoolSlugs) {
            const { data: schoolCourses } = await admin
              .from('academy_courses')
              .select('id')
              .eq('school_slug', otherSlug)

            const schoolCourseIds = schoolCourses?.map(c => c.id) ?? []
            
            const { data: passedCourses } = await admin
              .from('academy_progress')
              .select('course_id')
              .eq('user_id', user.id)
              .in('course_id', schoolCourseIds)
              .eq('passed', true)

            if ((passedCourses?.length ?? 0) < schoolCourseIds.length) {
              locked = { locked: true, reason: 'Finish all courses in your currently enrolled school first.' }
              break
            }
          }
        }
      }
    } else {
      locked = { locked: true, reason: 'Sign in to access this course.' }
    }

    return NextResponse.json({ course, enrollment, progress, locked })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const sb = await supabaseServer()
    const { data: { user }, error: authError } = await sb.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'You must be logged in to enroll.' }, { status: 401 })
    }

    const admin = supabaseAdmin()

    const { data: course } = await admin
      .from('academy_courses')
      .select('id, school_slug, school_order_index')
      .eq('slug', slug)
      .single()

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // ── LOCK CHECK 1: Previous course in same school ──
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
          .eq('user_id', user.id)
          .eq('course_id', prevCourse.id)
          .single()

        if (!prevProgress?.passed) {
          return NextResponse.json({ error: 'Complete the previous course in this school first.' }, { status: 403 })
        }
      }
    }

    // ── LOCK CHECK 2: Cross-school lock ──
    const { data: userEnrollments } = await admin
      .from('academy_enrollments')
      .select('course_id')
      .eq('user_id', user.id)

    if (userEnrollments && userEnrollments.length > 0) {
      const enrolledCourseIds = userEnrollments.map(e => e.course_id)

      const { data: enrolledCourses } = await admin
        .from('academy_courses')
        .select('id, school_slug')
        .in('id', enrolledCourseIds)

      const otherSchoolSlugs = [...new Set(
        (enrolledCourses ?? [])
          .filter(c => c.school_slug !== course.school_slug)
          .map(c => c.school_slug)
      )]

      for (const otherSlug of otherSchoolSlugs) {
        const { data: schoolCourses } = await admin
          .from('academy_courses')
          .select('id')
          .eq('school_slug', otherSlug)

        const schoolCourseIds = schoolCourses?.map(c => c.id) ?? []

        const { data: passedCourses } = await admin
          .from('academy_progress')
          .select('course_id')
          .eq('user_id', user.id)
          .in('course_id', schoolCourseIds)
          .eq('passed', true)

        if ((passedCourses?.length ?? 0) < schoolCourseIds.length) {
          return NextResponse.json({
            error: 'You are already enrolled in another school. Finish all courses there first.'
          }, { status: 403 })
        }
      }
    }

    // ── Enroll ──
    const { error: enrollError } = await admin
      .from('academy_enrollments')
      .upsert({ user_id: user.id, course_id: course.id }, { onConflict: 'user_id,course_id' })

    if (enrollError) {
      return NextResponse.json({ error: enrollError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

