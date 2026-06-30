import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
   const diasporaId = (await params).id.replace(/-/g, '/')

    const { data: member, error } = await supabase
      .from('diaspora')
      .select('*')
      .eq('diaspora_id', diasporaId)
      .single()

    if (error || !member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json({ member })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}