import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const supabase = supabaseAdmin()
  const { data, error } = await supabase.from('news_articles').select('*').order('date', { ascending: false })
  if (error) return NextResponse.json({ articles: [] }, { status: 500 })
  return NextResponse.json({ articles: data })
}