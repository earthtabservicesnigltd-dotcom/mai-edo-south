import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = supabaseAdmin()

    // Insert the Question into Database
    // The URLs are already uploaded by the frontend!
    const { data, error } = await supabase
      .from('ask_mai_questions')
      .insert({
        full_name: body.full_name,
        email: body.email,
        phone: body.phone,
        lga: body.lga,
        community: body.community,
        category: body.category,
        title: body.title,
        question: body.question,
        video_url: body.video_url || null,
        attachment_url: body.attachment_url || null
      })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Ask MAI Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}