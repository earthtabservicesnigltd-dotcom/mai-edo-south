import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const [
      { count: volunteers },
      { count: pendingVolunteers },
      { count: donations },
      { count: feedback },
      { data: recentVolunteers },
    ] = await Promise.all([
      supabase.from('volunteers').select('*', { count: 'exact', head: true }),
      supabase.from('volunteers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('donations').select('*', { count: 'exact', head: true }),
      supabase.from('feedback').select('*', { count: 'exact', head: true }),
      supabase.from('volunteers').select('id, volunteer_id, first_name, last_name, lga, status, created_at').order('created_at', { ascending: false }).limit(5),
    ])

    return NextResponse.json({
      stats: {
        volunteers: volunteers ?? 0,
        pendingVolunteers: pendingVolunteers ?? 0,
        donations: donations ?? 0,
        feedback: feedback ?? 0,
      },
      recentVolunteers: recentVolunteers ?? [],
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}