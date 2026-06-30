import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: submissions, error } = await supabase
      .from('mai_listens')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ submissions })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, resolveAll } = await req.json()

    if (resolveAll) {
      const { data: unresolved, error: fetchError } = await supabase
        .from('mai_listens')
        .select('id')
        .neq('status', 'resolved')

      if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

      const { error: updateError } = await supabase
        .from('mai_listens')
        .update({ status: 'resolved' })
        .neq('status', 'resolved')

      if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

      return NextResponse.json({ success: true, resolved: unresolved?.length ?? 0 })
    }

    const { error } = await supabase
      .from('mai_listens')
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
      .from('mai_listens')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}