import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { courseId, locked } = await req.json()
    const admin = supabaseAdmin()
    const { error } = await admin
      .from('academy_courses')
      .update({ assessments_locked: locked })
      .eq('id', courseId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
