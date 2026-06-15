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
      { count: donations },
      { count: feedback },
      { count: diasporaMembers },
      { count: maiListensTotal },
      { count: maiListensUnread },
      { data: recentVolunteers },
      { data: recentDiaspora },
      { data: recentSubmissions },
    ] = await Promise.all([
      supabase.from('volunteers').select('*', { count: 'exact', head: true }),
      supabase.from('volunteers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('donations').select('*', { count: 'exact', head: true }),
      supabase.from('feedback').select('*', { count: 'exact', head: true }),
      supabase.from('diaspora').select('*', { count: 'exact', head: true }),
      supabase.from('diaspora').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('mai_listens').select('*', { count: 'exact', head: true }),
      supabase.from('mai_listens').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
      supabase.from('volunteers').select('id, volunteer_id, first_name, last_name, lga, status, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('diaspora').select('id, diaspora_id, full_name, country, industry, status, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('mai_listens').select('id, full_name, categories, issue, status, created_at').order('created_at', { ascending: false }).limit(5),
    ])

    return NextResponse.json({
      stats: {
        volunteers: volunteers ?? 0,
        donations: donations ?? 0,
        feedback: feedback ?? 0,
        diasporaMembers: diasporaMembers ?? 0,
        maiListensTotal: maiListensTotal ?? 0,
        maiListensUnread: maiListensUnread ?? 0,
      },
      recentVolunteers: recentVolunteers ?? [],
      recentDiaspora: recentDiaspora ?? [],
      recentSubmissions: recentSubmissions ?? [],
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}