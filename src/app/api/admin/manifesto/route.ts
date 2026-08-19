import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = supabaseAdmin()
    const { data, error } = await supabase.from('settings').select('manifesto_url').eq('id', 1).single()
    if (error && error.code !== 'PGRST116') throw error
    return NextResponse.json({ url: data?.manifesto_url || null })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const filePath = 'manifesto.pdf'
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const supabase = supabaseAdmin()

    // 1. Upload to Supabase Storage using Admin (bypasses RLS)
    const { error: uploadError } = await supabase.storage
      .from('site-uploads')
      .upload(filePath, buffer, { 
        upsert: true,
        contentType: 'application/pdf'
      })

    if (uploadError) throw uploadError

    // 2. Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('site-uploads')
      .getPublicUrl(filePath)

    // 3. Save the URL to the database
    const { error: dbError } = await supabase
      .from('settings')
      .upsert({ id: 1, manifesto_url: publicUrlData.publicUrl })

    if (dbError) throw dbError

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl })
  } catch (error: any) {
    console.error('Manifesto Upload Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const supabase = supabaseAdmin()

    // 1. Remove the URL from the database
    const { error: dbError } = await supabase
      .from('settings')
      .update({ manifesto_url: null })
      .eq('id', 1)
    
    if (dbError) throw dbError

    // 2. Delete the file from Storage
    const { error: storageError } = await supabase.storage
      .from('site-uploads')
      .remove(['manifesto.pdf'])

    // Ignore error if file doesn't exist, but log it
    if (storageError) console.error("Storage delete error:", storageError.message)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}