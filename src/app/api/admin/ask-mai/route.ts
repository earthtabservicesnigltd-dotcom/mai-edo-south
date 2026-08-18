// app/api/admin/ask-mai/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = supabaseAdmin()
    const { data: questions, error } = await supabase
      .from('ask_mai_questions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ questions })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const supabase = supabaseAdmin()

    const { data, error } = await supabase
      .from('ask_mai_questions')
      .update({ status: body.status })
      .eq('id', body.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}