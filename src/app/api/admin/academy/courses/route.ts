import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const admin = supabaseAdmin()
    const { data: courses, error } = await admin
      .from('academy_courses')
      .select('*, academy_schools!inner(title as school_title)')
      .order('school_slug')
      .order('school_order_index')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ courses: courses ?? [] })  // ← was 'data'
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

