import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const sb = await supabaseServer()
    const { data: { user }, error: authError } = await sb.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const email = user.email

    const [
      { data: volunteer },
      { data: diaspora },
      { data: donations },
    ] = await Promise.all([
      supabase
        .from('volunteers')
        .select('volunteer_id, status, lga, volunteer_areas, created_at')
        .eq('email', email)
        .single(),
      supabase
        .from('diaspora')
        .select('diaspora_id, status, country, lga_origin, created_at')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('donations')
        .select('id, amount, payment_method, status, created_at')
        .eq('email', email)
        .order('created_at', { ascending: false }),
    ])

    return NextResponse.json({
      volunteer: volunteer ?? null,
      diaspora: diaspora ?? null,
      donations: donations ?? [],
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}