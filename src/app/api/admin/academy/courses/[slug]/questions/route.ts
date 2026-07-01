import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const admin = supabaseAdmin()
    
    const { data: course } = await admin.from('academy_courses').select('id, title').eq('slug', slug).single()
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    const { data: questions, error } = await admin
      .from('academy_questions')
      .select('*')
      .eq('course_id', course.id)
      .order('order_index')
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ course, questions: questions ?? [] })
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
    const body = await req.json()
    const admin = supabaseAdmin()

    const { data: course } = await admin.from('academy_courses').select('id').eq('slug', slug).single()
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    if (body.deleteId) {
      await admin.from('academy_questions').delete().eq('id', body.deleteId)
      return NextResponse.json({ success: true })
    }

    if (body.id) {
      const { data, error } = await admin.from('academy_questions').update({
        question: body.question, option_a: body.option_a, option_b: body.option_b,
        option_c: body.option_c, option_d: body.option_d, correct_answer: body.correct_answer,
        order_index: body.order_index,
      }).eq('id', body.id).select().single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ question: data })
    }

    const { data, error } = await admin.from('academy_questions').insert({
      course_id: course.id, question: body.question,
      option_a: body.option_a, option_b: body.option_b, option_c: body.option_c, option_d: body.option_d,
      correct_answer: body.correct_answer, order_index: body.order_index,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ question: data })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
