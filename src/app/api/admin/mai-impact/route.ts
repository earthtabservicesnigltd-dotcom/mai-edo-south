import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = supabaseAdmin()
    const { data: stories, error } = await supabase
      .from('mai_impact_stories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ stories })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const supabase = supabaseAdmin()

    const { data, error } = await supabase
      .from('mai_impact_stories')
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

    // 1. Fetch the story to get the file URLs
    const { data: story } = await supabase
      .from('mai_impact_stories')
      .select('file_urls')
      .eq('id', id)
      .single()

    // 2. Delete the record from the database
    const { error: dbError } = await supabase
      .from('mai_impact_stories')
      .delete()
      .eq('id', id)

    if (dbError) throw dbError

    // 3. Delete files from Supabase Storage if they exist
    if (story?.file_urls && story.file_urls.length > 0) {
      for (const url of story.file_urls) {
        try {
          const urlParts = url.split('/mai-impact-uploads/')
          if (urlParts.length === 2) {
            const filePath = urlParts[1]
            await supabase.storage.from('mai-impact-uploads').remove([filePath])
          }
        } catch (e) {
          console.error("Failed to delete storage file:", e)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}