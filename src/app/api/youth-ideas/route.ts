import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = supabaseAdmin()
    
    const { data, error } = await supabase
      .from('youth_ideas')
      .insert({
        idea_type: body.idea_type,
        title: body.title,
        description: body.description,
        lga: body.lga,
        file_url: body.file_url || null
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}