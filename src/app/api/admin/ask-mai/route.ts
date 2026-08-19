import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = supabaseAdmin()
    const { data: questions, error } = await supabase
      .from('ask_mai_questions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ questions })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const supabase = supabaseAdmin()

    const { data, error } = await supabase
      .from('ask_mai_questions')
      .update({ status: body.status })
      .eq('id', body.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const supabase = supabaseAdmin()

    // 1. Fetch the question to get the file URLs
    const { data: question } = await supabase
      .from('ask_mai_questions')
      .select('video_url, attachment_url')
      .eq('id', id)
      .single()

    // 2. Delete the record from the database
    const { error: dbError } = await supabase
      .from('ask_mai_questions')
      .delete()
      .eq('id', id)

    if (dbError) throw dbError

    // 3. Helper function to delete file from Supabase Storage
    const deleteFile = async (url: string) => {
      try {
        const urlParts = url.split('/ask-mai-uploads/')
        if (urlParts.length === 2) {
          const filePath = urlParts[1]
          await supabase.storage.from('ask-mai-uploads').remove([filePath])
        }
      } catch (e) {
        console.error("Failed to delete storage file:", e)
      }
    }

    // 4. Delete the actual files if they exist
    if (question?.video_url) await deleteFile(question.video_url)
    if (question?.attachment_url) await deleteFile(question.attachment_url)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}