import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Await the params object
    const { id } = await params
    
    const supabase = supabaseAdmin()
    const { data: member, error } = await supabase
      .from('youth_council_members')
      .select('*')
      .eq('id', id) // 2. Use the unwrapped id
      .single()

    if (error) throw error
    return NextResponse.json({ member })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}