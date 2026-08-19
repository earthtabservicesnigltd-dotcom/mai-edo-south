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
        { error: 'You must register for the Women Network before submitting your voice.' },
        { status: 400 }
      )
    }

    // 2. Insert the voice submission
    const { data, error } = await supabase
      .from('women_voices')
      .insert({
        email: body.email, // Save email to link it!
        category: body.category,
        title: body.title,
        description: body.description,
        lga: body.lga,
        community: body.community
      })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}