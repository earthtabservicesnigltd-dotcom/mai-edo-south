import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendMail } from '@/lib/mail'
import { maiListensAcknowledgementEmail, maiListensAdminEmail } from '@/lib/email-templates';

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

export async function POST(req: NextRequest) {
  try {
    const { image_data, ...cleanBody } = await req.json()

    // ── Upload image to storage if provided ──
    let imageUrl = null
    if (image_data) {
      const base64Data = image_data.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      const filename = `mai-listens/${Date.now()}.jpg`
      const { data: uploadData } = await supabaseAdmin()
        .storage.from('mai-listens-images')
        .upload(filename, buffer, { contentType: 'image/jpeg' })
      if (uploadData) {
        imageUrl = supabaseAdmin().storage.from('mai-listens-images').getPublicUrl(filename).data.publicUrl
      }
    }

    const { data, error } = await supabaseAdmin()
      .from('mai_listens')
      .insert({ ...cleanBody, image_url: imageUrl, status: 'unread' })
      .select('id, full_name, email')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (cleanBody.consent && cleanBody.email) {
      try {
        await sendMail({
          to: cleanBody.email,
          subject: "We've Received Your Submission — MAI Listens",
          html: maiListensAcknowledgementEmail({
            firstName: cleanBody.full_name.split(' ')[0],
            referenceId: data.id,
            dateSubmitted: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
            community: cleanBody.community,
            categories: cleanBody.categories,
          }),
        })
      } catch (emailErr: any) {
        console.log('Acknowledgement email error:', emailErr.message)
      }
    }

    try {
      await sendMail({
        to: process.env.ADMIN_EMAIL!,
        subject: `New MAI Listens Submission — ${cleanBody.full_name}`,
        html: maiListensAdminEmail({
          fullName: cleanBody.full_name,
          email: cleanBody.email,
          phone: cleanBody.phone,
          categories: cleanBody.categories,
          issue: cleanBody.issue,
          lga: cleanBody.lga,
          ward: cleanBody.ward,
          community: cleanBody.community,
          priority: cleanBody.priority,
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

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, resolveAll } = await req.json()

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
