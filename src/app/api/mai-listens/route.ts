// app/api/mai-listens/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendMail } from '@/lib/mail'
import { maiListensAcknowledgementEmail, maiListensAdminEmail } from '@/lib/email-templates';

// ── GET — fetch all submissions (admin) ──
export async function GET() {
  try {
    const { data: submissions, error } = await supabaseAdmin()
      .from('mai_listens')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ submissions })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// ── POST — submit an issue (public, no auth required) ──
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { data, error } = await supabaseAdmin()
      .from('mai_listens')
      .insert({ ...body, status: 'unread' })
      .select('id, full_name, email')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (body.consent && body.email) {
      try {
        await sendMail({
          to: body.email,
          subject: "We've Received Your Submission — MAI Listens",
          html: maiListensAcknowledgementEmail({
            firstName: body.full_name.split(' ')[0],
            referenceId: data.id,
            dateSubmitted: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
            community: body.community,
            categories: body.categories,
          }),
        })
      } catch (emailErr: any) {
        console.log('Acknowledgement email error:', emailErr.message)
      }
    }

    // Notify admin of new submission
    try {
      await sendMail({
        to: process.env.ADMIN_EMAIL!,
        subject: `New MAI Listens Submission — ${body.full_name}`,
        html: maiListensAdminEmail({
          fullName: body.full_name,
          email: body.email,
          phone: body.phone,
          categories: body.categories,
          issue: body.issue,
          lga: body.lga,
          ward: body.ward,
          community: body.community,
          priority: body.priority,
        }),
      })
    } catch (emailErr: any) {
      console.log('Admin notification error:', emailErr.message)
    }

    return NextResponse.json({ success: true, submission: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// ── PATCH — update status (admin: unread → read → resolved) ──
export async function PATCH(req: NextRequest) {
  try {
    const { id, status, resolveAll } = await req.json()

    // ── RESOLVE ALL ──
    if (resolveAll) {
      const { data: unresolved, error: fetchError } = await supabaseAdmin()
        .from('mai_listens')
        .select('id, full_name, email, consent')
        .neq('status', 'resolved')

      if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

      const { error: updateError } = await supabaseAdmin()
        .from('mai_listens')
        .update({ status: 'resolved' })
        .neq('status', 'resolved')

      if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

      return NextResponse.json({ success: true, resolved: unresolved?.length ?? 0 })
    }

    // ── SINGLE UPDATE ──
    const { data: submission, error: fetchError } = await supabaseAdmin()
      .from('mai_listens')
      .select('full_name, email, consent')
      .eq('id', id)
      .single()

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

    const { error } = await supabaseAdmin()
      .from('mai_listens')
      .update({ status })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// ── DELETE — remove a submission (admin) ──
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const { error } = await supabaseAdmin()
      .from('mai_listens')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}