import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      first_name, last_name, email, phone,
      location, lga, availability,
      area_of_interest, message, photoBase64
    } = body

    if (!first_name || !last_name || !email || !phone || !location || !lga || !availability || !area_of_interest) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let photo_url = ''

    if (photoBase64) {
      // Convert base64 to buffer
      const base64Data = photoBase64.split(',')[1]
      const mimeType = photoBase64.split(';')[0].split(':')[1]
      const buffer = Buffer.from(base64Data, 'base64')
      const ext = mimeType.split('/')[1]
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('volunteer-bucket')
        .upload(fileName, buffer, { contentType: mimeType })

      if (uploadError) {
        console.log('Storage error:', uploadError) // 👈
        return NextResponse.json({ error: 'Photo upload failed' }, { status: 500 })
      }

      const { data: { publicUrl } } = supabase.storage
        .from('volunteer-bucket')
        .getPublicUrl(fileName)

      photo_url = publicUrl
    }

    const { error } = await supabase.from('volunteers').insert({
      first_name, last_name, email, phone,
      location, lga, availability,
      area_of_interest, message, photo_url
    })

    if (error) {
      console.log('Insert error:', error) // 👈
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
        console.log('Caught error:', err) // 👈 this is the key one
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}