import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const supabase = supabaseAdmin()
  const { data, error } = await supabase.from('campaign_events').select('*').order('date', { ascending: false })
  if (error) return NextResponse.json({ events: [] }, { status: 500 })
  return NextResponse.json({ events: data })
}