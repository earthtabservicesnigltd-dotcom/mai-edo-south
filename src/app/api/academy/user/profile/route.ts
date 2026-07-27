import { NextResponse } from 'next/server'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabaseAdmin()
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()

    return NextResponse.json(profile ?? {})
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
