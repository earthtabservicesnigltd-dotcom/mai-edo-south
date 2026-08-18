import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = supabaseAdmin()
    
    const { data, error } = await supabase
      .from('women_leaders_circle')
      .insert({
        full_name: body.full_name,
        position_held: body.position_held,
        organization: body.organization,
        years_of_experience: body.years_of_experience,
        community_impact: body.community_impact
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}