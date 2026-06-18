import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: groups, error } = await supabase
      .from('support_groups')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ groups })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, verifyAll } = await req.json()

    if (verifyAll) {
      const { data: pending, error: fetchError } = await supabase
        .from('support_groups')
        .select('id')
        .eq('status', 'pending')

      if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

      const { error: updateError } = await supabase
        .from('support_groups')
        .update({ status: 'verified' })
        .eq('status', 'pending')

      if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

      return NextResponse.json({ success: true, verified: pending?.length ?? 0 })
    }

    const { error } = await supabase
      .from('support_groups')
      .update({ status })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const { error } = await supabase
      .from('support_groups')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}