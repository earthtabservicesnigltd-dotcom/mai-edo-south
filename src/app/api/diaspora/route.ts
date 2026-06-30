// app/api/diaspora/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendMail } from '@/lib/mail'
import { diasporaWelcomeEmail } from '@/lib/email-templates'

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { photo, ...formData } = body  // 👈 separate photo from form data

    // Check for duplicate email
    const { data: existing } = await supabaseAdmin()
      .from('diaspora')
      .select('id')
      .eq('email', formData.email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'This email is already registered with the MAI Diaspora Network.' },
        { status: 409 }
      )
    }

    // Upload photo if provided
    let photo_url = null
    if (photo) {
      const base64Data = photo.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      const ext = photo.match(/^data:image\/(\w+);/)?.[1] || 'jpg'
      const filename = `${Date.now()}-${formData.email.replace(/[@.]/g, '-')}.${ext}`

      const { error: uploadError } = await supabaseAdmin()
        .storage
        .from('diaspora-photos')
        .upload(filename, buffer, { contentType: `image/${ext}`, upsert: false })

      if (!uploadError) {
        const { data: { publicUrl } } = supabaseAdmin()
          .storage
          .from('diaspora-photos')
          .getPublicUrl(filename)
        photo_url = publicUrl
      }
    }

    const { data, error } = await supabaseAdmin()
      .from('diaspora')
      .insert({ ...formData, photo_url, status: 'approved' })
      .select('id, diaspora_id, full_name, email, country, lga_origin, industry, created_at, photo_url')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    try {
      await sendMail({
        to: formData.email,
        subject: 'Welcome to the MAI Diaspora Network — Your Membership Card',
        html: diasporaWelcomeEmail(
          formData.full_name.split(' ')[0],
          data.diaspora_id,
          new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
          formData.country,
        ),
      })
    } catch (emailErr: any) {
      console.log('Diaspora welcome email error:', emailErr.message)
    }

    return NextResponse.json({ success: true, diaspora: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
// // ── PATCH — approve / reject (admin) ──
// export async function PATCH(req: NextRequest) {
//   try {
//     const { id, status, approveAll } = await req.json()

//     // ── APPROVE ALL ──
//     if (approveAll) {
//       const { data: pending, error: fetchError } = await supabaseAdmin()
//         .from('diaspora')
//         .select('id, full_name, email, diaspora_id')
//         .eq('status', 'pending')

//       if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

//       const { error: updateError } = await supabaseAdmin()
//         .from('diaspora')
//         .update({ status: 'approved' })
//         .eq('status', 'pending')

//       if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

//       try {
//         await Promise.all(
//           (pending ?? []).map(d =>
//             sendMail({
//               to: d.email,
//               subject: 'Your Diaspora Registration Has Been Approved — MAI',
//               html: diasporaApprovalEmail(d.full_name, d.diaspora_id),
//             })
//           )
//         )
//       } catch (emailErr: any) {
//         console.log('Approve all email error:', emailErr.message)
//       }

//       return NextResponse.json({ success: true, approved: pending?.length ?? 0 })
//     }

//     // ── SINGLE UPDATE ──
//     const { data: member, error: fetchError } = await supabaseAdmin()
//       .from('diaspora')
//       .select('full_name, email, diaspora_id')
//       .eq('id', id)
//       .single()

//     if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

//     const { error } = await supabaseAdmin()
//       .from('diaspora')
//       .update({ status })
//       .eq('id', id)

//     if (error) return NextResponse.json({ error: error.message }, { status: 500 })

//     try {
//       if (status === 'approved') {
//         await sendMail({
//           to: member.email,
//           subject: 'Your Diaspora Registration Has Been Approved — MAI',
//           html: diasporaApprovalEmail(member.full_name, member.diaspora_id),
//         })
//       } else if (status === 'rejected') {
//         await sendMail({
//           to: member.email,
//           subject: 'Update on Your Diaspora Registration — MAI',
//           html: diasporaRejectionEmail(member.full_name),
//         })
//       }
//     } catch (emailErr: any) {
//       console.log('Email error:', emailErr.message)
//     }

//     return NextResponse.json({ success: true })
//   } catch {
//     return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
//   }
// }