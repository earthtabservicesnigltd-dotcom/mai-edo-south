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
        { error: 'You must register for the Women Network before listing a business.' },
        { status: 400 }
      )
    }

    // 2. Insert the business
    const { data, error } = await supabase
      .from('women_businesses')
      .insert({
        email: body.email, // Save email to link it!
        business_name: body.business_name,
        owner_name: body.owner_name,
        category: body.category,
        lga: body.lga,
        phone: body.phone,
        social_links: body.social_links,
        description: body.description
      })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}