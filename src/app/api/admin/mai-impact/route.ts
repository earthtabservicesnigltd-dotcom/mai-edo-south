// app/api/admin/mai-impact/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = supabaseAdmin()
    const { data: stories, error } = await supabase
      .from('mai_impact_stories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ stories })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const supabase = supabaseAdmin()

    const { data, error } = await supabase
      .from('mai_impact_stories')
      .update({ status: body.status })
      .eq('id', body.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}