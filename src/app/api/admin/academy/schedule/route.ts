import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const admin = supabaseAdmin()
    const { data, error } = await admin
      .from('academy_schedule')
      .select('*')
      .order('day_of_week')
      .order('sort_order')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ schedule: data ?? [] })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const admin = supabaseAdmin()

    if (body.bulk) {
      // Replace all schedule entries
      await admin.from('academy_schedule').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      const { data, error } = await admin.from('academy_schedule').insert(body.entries).select()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ schedule: data })
    }

    if (body.id) {
      const { data, error } = await admin.from('academy_schedule').update(body).eq('id', body.id).select().single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ schedule: data })
    }

    const { data, error } = await admin.from('academy_schedule').insert(body).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ schedule: data })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    const admin = supabaseAdmin()
    await admin.from('academy_schedule').delete().eq('id', id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
