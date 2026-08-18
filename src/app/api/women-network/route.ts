import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = supabaseAdmin()
    
    const { data, error } = await supabase
      .from('women_network_members')
      .insert({
        full_name: body.full_name,
        date_of_birth: body.date_of_birth,
        phone: body.phone,
        whatsapp_number: body.whatsapp_number,
        email: body.email,
        lga: body.lga,
        ward: body.ward,
        community: body.community,
        occupation: body.occupation,
        areas_of_interest: body.areas_of_interest
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, member: data })
  } catch (error: any) {
    console.error('Women Network Registration Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to register. Please try again.' },
      { status: 500 }
    )
  }
}