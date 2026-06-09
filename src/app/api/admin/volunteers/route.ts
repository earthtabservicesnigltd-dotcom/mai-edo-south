import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mail'
import { volunteerApprovalEmail, volunteerRejectionEmail } from '@/lib/email-templates'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: volunteers, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ volunteers })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, approveAll } = await req.json()

    // ── APPROVE ALL ──
    if (approveAll) {
      const { data: pending, error: fetchError } = await supabase
        .from('volunteers')
        .select('id, first_name, email, volunteer_id')
        .eq('status', 'pending')

      if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

      const { error: updateError } = await supabase
        .from('volunteers')
        .update({ status: 'approved' })
        .eq('status', 'pending')

      if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

      // Send approval emails to all
      await Promise.all(
        (pending ?? []).map(v =>
          sendMail({
            to: v.email,
            subject: 'Your Volunteer Application Has Been Approved — MAI Edo South',
            html: volunteerApprovalEmail(v.first_name, v.volunteer_id),
          })
        )
      )

      return NextResponse.json({ success: true, approved: pending?.length ?? 0 })
    }

    // ── SINGLE UPDATE ──
    const { data: volunteer, error: fetchError } = await supabase
      .from('volunteers')
      .select('first_name, email, volunteer_id')
      .eq('id', id)
      .single()

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

    const { error } = await supabase
      .from('volunteers')
      .update({ status })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Send email based on status
    if (status === 'approved') {
      await sendMail({
        to: volunteer.email,
        subject: 'Your Volunteer Application Has Been Approved — MAI Edo South',
        html: volunteerApprovalEmail(volunteer.first_name, volunteer.volunteer_id),
      })
    } else if (status === 'rejected') {
      await sendMail({
        to: volunteer.email,
        subject: 'Update on Your Volunteer Application — MAI Edo South',
        html: volunteerRejectionEmail(volunteer.first_name),
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}