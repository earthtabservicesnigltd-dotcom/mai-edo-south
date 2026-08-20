import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = supabaseAdmin()
    
    const { data: article, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return NextResponse.json({ article })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}