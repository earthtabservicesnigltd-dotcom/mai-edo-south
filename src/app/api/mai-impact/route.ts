import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = supabaseAdmin()
    
    const { data, error } = await supabase
      .from('mai_impact_stories')
      .insert({
        full_name: body.full_name,
        phone: body.phone,
        email: body.email,
        community: body.community,
        lga: body.lga,
        state_country: body.state_country,
        title: body.title,
        story: body.story,
        impact_category: body.impact_category,
        is_true: body.is_true,
        can_publish: body.can_publish,
        anonymous: body.anonymous
      })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}