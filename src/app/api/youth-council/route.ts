import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = supabaseAdmin()
    
    const { data, error } = await supabase
      .from('youth_council_members')
      .insert({
        full_name: body.full_name,
        date_of_birth: body.date_of_birth,
        gender: body.gender,
        phone: body.phone,
        whatsapp_number: body.whatsapp_number,
        email: body.email,
        lga: body.lga,
        ward: body.ward,
        community: body.community,
        education: body.education,
        occupation: body.occupation,
        areas_of_interest: body.areas_of_interest,
        commitment: body.commitment
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, member: data })
  } catch (error: any) {
    console.error('Youth Council Registration Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to register. Please try again.' },
      { status: 500 }
    )
  }
}