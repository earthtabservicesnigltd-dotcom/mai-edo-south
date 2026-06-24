import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: courses, error } = await supabase
      .from('academy_courses')
      .select('id, slug, title, short_label, description, icon, icon_bg, icon_color, certificate_title, order_index')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ courses })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}