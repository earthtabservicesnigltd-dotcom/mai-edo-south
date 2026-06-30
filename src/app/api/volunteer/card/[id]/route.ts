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
    const volunteerId = (await params).id.replace(/-/g, '/')

    const { data: volunteer, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('volunteer_id', volunteerId)
      .single()

    if (error || !volunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 })
    }

    return NextResponse.json({ volunteer })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}