import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mail'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function uploadFile(base64: string, fileName: string, folder: string): Promise<string> {
  if (!base64) return ''

  const base64Data = base64.split(',')[1]
  const mimeType = base64.split(';')[0].split(':')[1]
  const buffer = Buffer.from(base64Data, 'base64')
  const ext = fileName?.split('.').pop() || 'bin'
  const uniqueName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('support-group-bucket')
    .upload(uniqueName, buffer, { contentType: mimeType })

  if (error) {
    console.log(`${folder} upload error:`, error.message)
    return ''
  }

  const { data: { publicUrl } } = supabase.storage
    .from('support-group-bucket')
    .getPublicUrl(uniqueName)

  return publicUrl
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      org_name, acronym, org_type, year_established, state, lga, ward, community,
      coordinator_name, position, phone, whatsapp, email,
      total_members, active_members, estimated_supporters,
      facebook, twitter, instagram, website, agreed,
      membershipDatabaseBase64, membershipDatabaseName,
      groupLogoBase64, groupLogoName,
      certOfRegBase64, certOfRegName,
      constitutionBase64, constitutionName,
      groupPhotoBase64, groupPhotoName,
    } = body

    if (!org_name || !org_type || !state || !lga || !coordinator_name || !position || !phone || !email || !agreed) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check for duplicate
    const { data: existing } = await supabase
      .from('support_groups')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'A support group with this email has already been registered.' },
        { status: 409 }
      )
    }

    // Upload all files in parallel
    const [
      membership_database_url,
      group_logo_url,
      cert_of_reg_url,
      constitution_url,
      group_photo_url,
    ] = await Promise.all([
      uploadFile(membershipDatabaseBase64, membershipDatabaseName, 'membership-db'),
      uploadFile(groupLogoBase64, groupLogoName, 'logos'),
      uploadFile(certOfRegBase64, certOfRegName, 'certs'),
      uploadFile(constitutionBase64, constitutionName, 'constitutions'),
      uploadFile(groupPhotoBase64, groupPhotoName, 'photos'),
    ])

    const { data: group, error } = await supabase
      .from('support_groups')
      .insert({
        org_name, acronym, org_type, year_established, state, lga, ward, community,
        coordinator_name, position, phone, whatsapp, email,
        total_members, active_members, estimated_supporters,
        facebook, twitter, instagram, website, agreed,
        membership_database_url, group_logo_url, cert_of_reg_url, constitution_url, group_photo_url,
      })
      .select()
      .single()

    if (error) {
      console.log('Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Notify admin
    try {
      await sendMail({
        to: process.env.ADMIN_EMAIL!,
        subject: `New Support Group Registration — ${org_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
            <div style="background: #01381d; padding: 24px;">
              <h2 style="color: #ffffff; margin: 0;">New Support Group Registration</h2>
              <p style="color: #f97316; margin: 4px 0 0; font-size: 12px; letter-spacing: 2px;">MAI EDO SOUTH 2027</p>
            </div>
            <div style="padding: 24px; background: #ffffff;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase; width: 40%;">Group ID</td><td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #f97316;">${group.support_group_id}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Organization</td><td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">${org_name}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Type</td><td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${org_type}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Coordinator</td><td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${coordinator_name} (${position})</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Phone</td><td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${phone}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Email</td><td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${email}</td></tr>
                <tr><td style="padding: 10px; color: #888; font-size: 12px; text-transform: uppercase;">Location</td><td style="padding: 10px;">${community || ''}, ${ward || ''}, ${lga}, ${state}</td></tr>
              </table>
              <div style="margin-top: 24px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/support-groups" style="background: #01381d; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">View in Dashboard</a>
              </div>
            </div>
          </div>
        `,
      })
    } catch (emailErr: any) {
      console.log('Admin notification error:', emailErr.message)
    }

    // Confirmation to coordinator
    try {
      await sendMail({
        to: email,
        subject: 'Support Group Registration Received — MAI Edo South',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
            <div style="background: #01381d; padding: 32px; text-align: center;">
              <img src="https://www.mai4senate.com/image_4.png" alt="MAI Logo" style="height: 70px; width: auto; margin-bottom: 16px;" />
              <h1 style="color: #ffffff; font-size: 32px; margin: 0; letter-spacing: 4px;">MAI</h1>
              <p style="color: #f97316; font-size: 11px; letter-spacing: 3px; margin: 6px 0 0; text-transform: uppercase;">Senatorial Campaign Organization</p>
            </div>
            <div style="padding: 40px 32px; background: #ffffff;">
              <h2 style="color: #111; font-size: 24px; margin: 0 0 24px;">Dear ${coordinator_name},</h2>
              <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
                Thank you for registering <strong>${org_name}</strong> as a support group with the MAI Senatorial Campaign Organization.
              </p>
              <p style="color: #555; line-height: 1.8; margin: 0 0 24px;">
                Your registration has been successfully received and is currently being reviewed by our team.
              </p>
              <div style="background: #f5f5f5; border-left: 4px solid #f97316; border-radius: 8px; padding: 20px 24px; margin: 0 0 24px;">
                <p style="margin: 0; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 2px;">Group ID</p>
                <p style="margin: 8px 0 0; font-size: 24px; font-weight: 900; color: #f97316;">${group.support_group_id}</p>
              </div>
              <p style="color: #555; line-height: 1.8; margin: 0 0 32px;">
                Together, we can build a stronger, more prosperous Edo South.
              </p>
              <div style="border-top: 1px solid #e5e5e5; padding-top: 24px;">
                <p style="color: #01381d; font-weight: bold; margin: 0; font-size: 14px;">MAI Senatorial Campaign Organization</p>
                <p style="color: #f97316; font-size: 12px; font-weight: bold; margin: 8px 0 0; letter-spacing: 2px; text-transform: uppercase;">The Time Is MAI</p>
              </div>
            </div>
          </div>
        `,
      })
    } catch (emailErr: any) {
      console.log('Confirmation email error:', emailErr.message)
    }

    return NextResponse.json({ success: true, group }, { status: 201 })
  } catch (err: any) {
    console.log('Caught error:', err.message)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}