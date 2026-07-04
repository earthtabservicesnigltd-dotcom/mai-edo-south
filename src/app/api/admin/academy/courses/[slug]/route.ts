import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const admin = supabaseAdmin()
    const { data: course, error } = await admin
      .from('academy_courses')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error || !course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    return NextResponse.json({ course })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await req.json()
    const admin = supabaseAdmin()
    const { data, error } = await admin
      .from('academy_courses')
      .update(body)
      .eq('slug', slug)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ course: data })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
