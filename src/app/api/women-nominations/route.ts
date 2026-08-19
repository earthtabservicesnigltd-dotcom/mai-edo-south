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
        { error: 'You must register for the Women Network before submitting a nomination.' },
        { status: 400 }
      )
    }

    // 2. Insert the nomination
    const { data, error } = await supabase
      .from('women_nominations')
      .insert({
        email: body.email, // Save email to link it!
        nominee_name: body.nominee_name,
        category: body.category,
        achievements: body.achievements
      })

    if (error) {
      // Check if the error is because the email already exists
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already registered for the Women Network.' },
          { status: 400 }
        )
      }
      throw error
    }
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}