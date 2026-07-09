import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PASS_THRESHOLD = 0.75 // 75% to pass

// GET — fetch questions (without correct answers exposed)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const { data: course } = await supabase
      .from('academy_courses')
      .select('id, title, certificate_title')
      .eq('slug', slug)
      .single()

    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    const { data: questions, error } = await supabase
      .from('academy_questions')
      .select('id, question, option_a, option_b, option_c, option_d, order_index')
      .eq('course_id', course.id)
      .order('order_index', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ course, questions })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// POST — submit answers, auto-grade, issue SCHOOL certificate if all courses done
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { answers } = await req.json()

    const sb = await supabaseServer()
    const { data: { user }, error: authError } = await sb.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
    }

    // Fetch course + its school info
    const { data: course } = await supabase
      .from('academy_courses')
      .select('id, certificate_title, school_slug')
      .eq('slug', slug)
      .single()

    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    // Grade the test
    const { data: questions, error: qError } = await supabase
      .from('academy_questions')
      .select('id, correct_answer')
      .eq('course_id', course.id)

    if (qError || !questions) {
      return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
    }

    let score = 0
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) score++
    })

    const totalQuestions = questions.length
    const passed = score / totalQuestions >= PASS_THRESHOLD

    // Track progress (same as before)
    const { data: existing } = await supabase
      .from('academy_progress')
      .select('test_attempts, best_score, passed')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single()

    const newAttempts = (existing?.test_attempts ?? 0) + 1
    const bestScore = Math.max(existing?.best_score ?? 0, score)
    const alreadyPassed = existing?.passed ?? false

    await supabase
      .from('academy_progress')
      .upsert({
        user_id: user.id,
        course_id: course.id,
        test_attempts: newAttempts,
        best_score: bestScore,
        total_questions: totalQuestions,
        passed: alreadyPassed || passed,
        passed_at: (alreadyPassed || passed) ? new Date().toISOString() : null,
        last_attempt_answers: answers,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' })

    // ── NEW: Only issue certificate if ALL courses in school are passed ──
    let certificate_id = null
    const justPassed = passed && !alreadyPassed

    if (justPassed && course.school_slug) {
      // Count total courses in this school
      const { data: schoolCourses, count: totalInSchool } = await supabase
        .from('academy_courses')
        .select('id', { count: 'exact', head: true })
        .eq('school_slug', course.school_slug)
        .eq('is_active', true)

      // Count how many the user has passed
      const { data: passedCourses } = await supabase
        .from('academy_progress')
        .select('course_id')
        .eq('user_id', user.id)
        .in('course_id', schoolCourses?.map(c => c.id) ?? [])
        .eq('passed', true)

      // If user has passed ALL courses in this school → issue school certificate
      if ((passedCourses?.length ?? 0) >= (totalInSchool ?? 0)) {
        const certResult = await supabase
          .from('academy_school_certificates')
          .upsert(
            { user_id: user.id, school_slug: course.school_slug },
            { onConflict: 'user_id,school_slug' }
          )
          .select('certificate_id')
          .single()

        certificate_id = certResult.data?.certificate_id ?? null
      }
    }

    // Return info about next steps
    const { data: allSchoolCourses } = await supabase
      .from('academy_courses')
      .select('id')
      .eq('school_slug', course.school_slug)
      .eq('is_active', true)

    const { data: pCourses } = await supabase
      .from('academy_progress')
      .select('course_id')
      .eq('user_id', user.id)
      .in('course_id', allSchoolCourses?.map(c => c.id) ?? [])
      .eq('passed', true)

    const totalInSchoolCompleted = pCourses?.length ?? 0
    const totalInSchool = allSchoolCourses?.length ?? 0
    const schoolComplete = totalInSchoolCompleted >= totalInSchool

    return NextResponse.json({
      success: true,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      passed,
      certificate_id,
      schoolComplete,
      schoolProgress: { completed: totalInSchoolCompleted, total: totalInSchool },
    })

  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
