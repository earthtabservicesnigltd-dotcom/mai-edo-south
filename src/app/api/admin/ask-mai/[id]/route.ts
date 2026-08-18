import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = supabaseAdmin()
    
    const { data: question, error } = await supabase
      .from('ask_mai_questions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return NextResponse.json({ question })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}