import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mail'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: members, error } = await supabase
      .from('diaspora')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ members })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, approveAll } = await req.json()

    if (approveAll) {
      const { data: pending, error: fetchError } = await supabase
        .from('diaspora')
        .select('id, full_name, email, diaspora_id')
        .eq('status', 'pending')

      if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

      const { error: updateError } = await supabase
        .from('diaspora')
        .update({ status: 'approved' })
        .eq('status', 'pending')

      if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

      // try {
      //   await Promise.all(
      //     (pending ?? []).map(d =>
      //       sendMail({
      //         to: d.email,
      //         subject: 'Your Diaspora Registration Has Been Approved — MAI',
      //         html: diasporaApprovalEmail(d.full_name, d.diaspora_id),
      //       })
      //     )
      //   )
      // } catch (emailErr: any) {
      //   console.log('Approve all email error:', emailErr.message)
      // }

      return NextResponse.json({ success: true, approved: pending?.length ?? 0 })
    }

    const { data: member, error: fetchError } = await supabase
      .from('diaspora')
      .select('full_name, email, diaspora_id, status')
      .eq('id', id)
      .single()

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

    const statusChanged = member.status !== status

    const { error } = await supabase
      .from('diaspora')
      .update({ status })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // try {
    //   if (statusChanged && status === 'approved') {
    //     await sendMail({
    //       to: member.email,
    //       subject: 'Your Diaspora Registration Has Been Approved — MAI',
    //       html: diasporaApprovalEmail(member.full_name, member.diaspora_id),
    //     })
    //   } else if (statusChanged && status === 'rejected') {
    //     await sendMail({
    //       to: member.email,
    //       subject: 'Update on Your Diaspora Registration — MAI',
    //       html: diasporaRejectionEmail(member.full_name),
    //     })
    //   }
    // } catch (emailErr: any) {
    //   console.log('Email error:', emailErr.message)
    // }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}