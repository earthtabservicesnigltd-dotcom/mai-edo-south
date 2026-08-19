import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = supabaseAdmin()
    
    // 1. Check if the user is a registered member
    const { data: member } = await supabase
      .from('women_network_members')
      .select('id')
      .eq('email', body.email)
      .maybeSingle()

    if (!member) {
      return NextResponse.json(
        { error: 'You must register for the Women Network before applying to the Leaders Circle.' },
        { status: 400 }
      )
    }

    // 2. Insert the application
    const { data, error } = await supabase
      .from('women_leaders_circle')
      .insert({
        email: body.email, // Save email to link it!
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