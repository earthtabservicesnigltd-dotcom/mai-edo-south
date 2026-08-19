import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const supabase = supabaseAdmin()
    
    // Upsert checks if the email exists. If it does, it updates it. If not, it inserts a new row.
    const { error } = await supabase
      .from('subscribers')
      .upsert({ 
        email, 
        status: 'active' 
      }, { 
        onConflict: 'email' 
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Subscribe Error:', error.message)
    return NextResponse.json({ error: error.message || 'Failed to subscribe' }, { status: 500 })
  }
}