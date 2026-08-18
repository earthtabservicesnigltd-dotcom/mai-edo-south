import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = supabaseAdmin()
    
    // 1. Fetch main member details
    const { data: member, error: memberError } = await supabase
      .from('women_network_members')
      .select('*')
      .eq('id', id)
      .single()

    if (memberError) throw memberError

    // 2. Fetch related records from other 4 tables using the member's email
    const email = member.email
    let voices = [], businesses = [], leaders = [], nominations = []

    if (email) {
      const [vRes, bRes, lRes, nRes] = await Promise.all([
        supabase.from('women_voices').select('*').eq('email', email),
        supabase.from('women_businesses').select('*').eq('email', email),
        supabase.from('women_leaders_circle').select('*').eq('email', email),
        supabase.from('women_nominations').select('*').eq('email', email)
      ])

      voices = vRes.data || []
      businesses = bRes.data || []
      leaders = lRes.data || []
      nominations = nRes.data || []
    }

    return NextResponse.json({ 
      member, 
      voices, 
      businesses, 
      leaders, 
      nominations 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}