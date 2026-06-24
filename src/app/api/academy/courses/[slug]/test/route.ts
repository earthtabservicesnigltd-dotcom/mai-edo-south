import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PASS_THRESHOLD = 0.7 // 70% to pass

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

// POST — submit answers, auto-grade
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { answers } = await req.json() // { questionId: 'A', ... }

    const sb = await supabaseServer()
    const { data: { user }, error: authError } = await sb.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
    }

    const { data: course } = await supabase
      .from('academy_courses')
      .select('id, certificate_title')
      .eq('slug', slug)
      .single()

    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

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

    // Get current progress to track attempts + best score
    const { data: existing } = await supabase
      .from('academy_progress')
      .select('test_attempts, best_score, passed')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single()

    const newAttempts = (existing?.test_attempts ?? 0) + 1
    const bestScore = Math.max(existing?.best_score ?? 0, score)
    const alreadyPassed = existing?.passed ?? false

    const { error: updateError } = await supabase
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

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

    // Issue certificate if just passed
    if (passed && !alreadyPassed) {
      await supabase
        .from('academy_certificates')
        .upsert({ user_id: user.id, course_id: course.id }, { onConflict: 'user_id,course_id' })
    }

    return NextResponse.json({
      success: true,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      passed,
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}