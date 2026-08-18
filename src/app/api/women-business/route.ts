import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = supabaseAdmin()
    
    const { data, error } = await supabase
      .from('women_businesses')
      .insert({
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