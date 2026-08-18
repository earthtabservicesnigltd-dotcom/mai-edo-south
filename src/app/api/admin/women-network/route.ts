import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = supabaseAdmin()
    const { data: members, error } = await supabase
      .from('women_network_members')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ members })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const supabase = supabaseAdmin()

    if (body.approveAll) {
      const { data, error } = await supabase
        .from('women_network_members')
        .update({ status: 'approved' })
        .eq('status', 'pending')
        .select('id')

      if (error) throw error
      return NextResponse.json({ approved: data?.length || 0 })
    }

    const { data, error } = await supabase
      .from('women_network_members')
      .update({ status: body.status })
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, member: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}