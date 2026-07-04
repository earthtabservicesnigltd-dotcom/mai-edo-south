import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin().from('academy_capstones').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ capstones: data ?? [] })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const admin = supabaseAdmin()
    if (body.deleteId) {
      await admin.from('academy_capstones').delete().eq('id', body.deleteId)
      return NextResponse.json({ success: true })
    }
    if (body.id) {
      const { data } = await admin.from('academy_capstones').update(body).eq('id', body.id).select().single()
      return NextResponse.json({ capstone: data })
    }
    const { data } = await admin.from('academy_capstones').insert(body).select().single()
    return NextResponse.json({ capstone: data })
  } catch { return NextResponse.json({ error: 'Something went wrong' }, { status: 500 }) }
}
