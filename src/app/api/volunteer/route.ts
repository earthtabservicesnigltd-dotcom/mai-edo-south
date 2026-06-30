import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mail'
import { volunteerConfirmationEmail, volunteerAdminEmail } from '@/lib/email-templates'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      first_name, last_name, gender, date_of_birth,
      phone, whatsapp_number, email,
      residential_address, lga, ward, polling_unit, community,
      motivation, physical_availability,
      previous_experience, experience_details,
      volunteer_areas, skills,
      commitment, photoBase64,
    } = body

    if (!first_name || !last_name || !gender || !date_of_birth || !phone || !lga || !ward || !physical_availability) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('volunteers')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'This email is already registered as a volunteer.' }, { status: 409 })
    }

    let photo_url = ''

    if (photoBase64) {
      const base64Data = photoBase64.split(',')[1]
      const mimeType = photoBase64.split(';')[0].split(':')[1]
      const buffer = Buffer.from(base64Data, 'base64')
      const ext = mimeType.split('/')[1]
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('volunteer-bucket')
        .upload(fileName, buffer, { contentType: mimeType })

      if (uploadError) {
        console.log('Storage error:', uploadError)
        return NextResponse.json({ error: 'Photo upload failed' }, { status: 500 })
      }

      const { data: { publicUrl } } = supabase.storage
        .from('volunteer-bucket')
        .getPublicUrl(fileName)

      photo_url = publicUrl
    }

    const { data: volunteer, error } = await supabase
      .from('volunteers')
      .insert({
        first_name, last_name, gender, date_of_birth,
        phone, whatsapp_number, email,
        residential_address, lga, ward, polling_unit, community,
        motivation, physical_availability,
        previous_experience, experience_details,
        volunteer_areas, skills,
        commitment, photo_url,
      })
      .select()
      .single()

    if (error) {
      console.log('Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send emails — don't fail the request if email fails
    try {
      await Promise.all([
        sendMail({
          to: email,
          subject: 'Welcome to the MAI Movement — Application Received',
          html: volunteerConfirmationEmail(first_name, volunteer.volunteer_id),
        }),
        sendMail({
          to: process.env.ADMIN_EMAIL!,
          subject: `New Volunteer Application — ${first_name} ${last_name}`,
          html: volunteerAdminEmail({
            firstName: first_name,
            lastName: last_name,
            email,
            phone,
            lga,
            ward,
            volunteerId: volunteer.volunteer_id,
            volunteerAreas: volunteer_areas,
          }),
        }),
      ])
    } catch (emailErr: any) {
      console.log('Email error:', emailErr.message)
    }

    return NextResponse.json({ success: true, volunteer }, { status: 201 })

  } catch (err: any) {
    console.log('Caught error:', err.message)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}