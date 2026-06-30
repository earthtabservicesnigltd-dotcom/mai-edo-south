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
      { count: diasporaMembers },
      { count: pendingDiaspora },
      { count: maiListensTotal },
      { count: maiListensUnread },
      { count: supportGroups },
      { count: pendingSupportGroups },
      { data: recentVolunteers },
      { data: recentDiaspora },
      { data: recentSubmissions },
      { data: recentSupportGroups },
    ] = await Promise.all([
      supabase.from('volunteers').select('*', { count: 'exact', head: true }),
      supabase.from('volunteers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('donations').select('*', { count: 'exact', head: true }),
      supabase.from('feedback').select('*', { count: 'exact', head: true }),
      supabase.from('diaspora').select('*', { count: 'exact', head: true }),
      supabase.from('diaspora').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('mai_listens').select('*', { count: 'exact', head: true }),
      supabase.from('mai_listens').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
      supabase.from('support_groups').select('*', { count: 'exact', head: true }),
      supabase.from('support_groups').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('volunteers').select('id, volunteer_id, first_name, last_name, lga, status, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('diaspora').select('id, diaspora_id, full_name, country, industry, status, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('mai_listens').select('id, full_name, categories, issue, status, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('support_groups').select('id, support_group_id, org_name, lga, status, created_at').order('created_at', { ascending: false }).limit(5),
    ])

    return NextResponse.json({
      stats: {
        volunteers: volunteers ?? 0,
        pendingVolunteers: pendingVolunteers ?? 0,
        donations: donations ?? 0,
        feedback: feedback ?? 0,
        diasporaMembers: diasporaMembers ?? 0,
        pendingDiaspora: pendingDiaspora ?? 0,
        maiListensTotal: maiListensTotal ?? 0,
        maiListensUnread: maiListensUnread ?? 0,
        supportGroups: supportGroups ?? 0,
        pendingSupportGroups: pendingSupportGroups ?? 0,
      },
      recentVolunteers: recentVolunteers ?? [],
      recentDiaspora: recentDiaspora ?? [],
      recentSubmissions: recentSubmissions ?? [],
      recentSupportGroups: recentSupportGroups ?? [],
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}