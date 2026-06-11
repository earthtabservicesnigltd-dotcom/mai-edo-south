// app/api/diaspora/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase'
import { sendMail } from '@/lib/mail'
import { diasporaApprovalEmail, diasporaRejectionEmail } from '@/lib/email-templates'

// ── GET — fetch all diaspora entries (admin) ──
export async function GET() {
  try {
    const { data: diaspora, error } = await supabaseAdmin()
      .from('diaspora')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ diaspora })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// ── POST — submit diaspora registration (must be signed in) ──
export async function POST(req: NextRequest) {
  try {
    const sb = await supabaseServer()
    const { data: { user }, error: authError } = await sb.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be signed in to submit a diaspora registration.' },
        { status: 401 }
      )
    }

    // Prevent duplicate submissions
    const { data: existing } = await supabaseAdmin()
      .from('diaspora')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'You have already submitted a diaspora registration.' },
        { status: 409 }
      )
    }

    const body = await req.json()

    const { data, error } = await supabaseAdmin()
      .from('diaspora')
      .insert({ ...body, user_id: user.id, status: 'pending' })
      .select('id, diaspora_id, full_name, email')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, diaspora: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// ── PATCH — approve / reject (admin) ──
export async function PATCH(req: NextRequest) {
  try {
    const { id, status, approveAll } = await req.json()

    // ── APPROVE ALL ──
    if (approveAll) {
      const { data: pending, error: fetchError } = await supabaseAdmin()
        .from('diaspora')
        .select('id, full_name, email, diaspora_id')
        .eq('status', 'pending')

      if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

      const { error: updateError } = await supabaseAdmin()
        .from('diaspora')
        .update({ status: 'approved' })
        .eq('status', 'pending')

      if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

      try {
        await Promise.all(
          (pending ?? []).map(d =>
            sendMail({
              to: d.email,
              subject: 'Your Diaspora Registration Has Been Approved — MAI',
              html: diasporaApprovalEmail(d.full_name, d.diaspora_id),
            })
          )
        )
      } catch (emailErr: any) {
        console.log('Approve all email error:', emailErr.message)
      }

      return NextResponse.json({ success: true, approved: pending?.length ?? 0 })
    }

    // ── SINGLE UPDATE ──
    const { data: member, error: fetchError } = await supabaseAdmin()
      .from('diaspora')
      .select('full_name, email, diaspora_id')
      .eq('id', id)
      .single()

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

    const { error } = await supabaseAdmin()
      .from('diaspora')
      .update({ status })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    try {
      if (status === 'approved') {
        await sendMail({
          to: member.email,
          subject: 'Your Diaspora Registration Has Been Approved — MAI',
          html: diasporaApprovalEmail(member.full_name, member.diaspora_id),
        })
      } else if (status === 'rejected') {
        await sendMail({
          to: member.email,
          subject: 'Update on Your Diaspora Registration — MAI',
          html: diasporaRejectionEmail(member.full_name),
        })
      }
    } catch (emailErr: any) {
      console.log('Email error:', emailErr.message)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}