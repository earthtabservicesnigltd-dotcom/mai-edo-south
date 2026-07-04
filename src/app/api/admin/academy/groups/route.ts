import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const DEFAULT_GROUP = {
  name: 'Group B — Business cohort',
  school_slug: 'school-of-business-entrepreneurship',
  cohort: 'Cohort 3',
  members: [
    { initials: 'EA', name: 'Emeka Ade', role: 'You', task: 'Marketing plan draft' },
    { initials: 'CO', name: 'Chiamaka Okoye', role: 'Member', task: 'Pricing strategy' },
    { initials: 'TI', name: 'Tega Ighodaro', role: 'Member', task: 'Target market research' },
    { initials: 'FU', name: 'Faith Uwagboe', role: 'Group lead', task: 'Coordinating capstone build' },
  ]
}

export async function GET() {
  return NextResponse.json({ group: DEFAULT_GROUP })
}
