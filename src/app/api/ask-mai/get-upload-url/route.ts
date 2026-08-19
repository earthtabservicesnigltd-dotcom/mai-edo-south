// app/api/ask-mai/get-upload-url/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { type, fileName } = await req.json()
    const supabase = supabaseAdmin()
    
    const folder = type === 'video' ? 'videos' : 'attachments'
    // Sanitize filename to avoid path issues
    const safeName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const filePath = `${folder}/${Date.now()}-${safeName}`
    
    // Create a secure signed URL that lasts for 5 minutes
    const { data, error } = await supabase.storage
      .from('ask-mai-uploads')
      .createSignedUploadUrl(filePath)

    if (error) throw error

    // Get the public URL so we can save it in the database later
    const { data: publicUrlData } = supabase.storage
      .from('ask-mai-uploads')
      .getPublicUrl(filePath)

    return NextResponse.json({ 
      signedUrl: data.signedUrl, 
      publicUrl: publicUrlData.publicUrl,
      path: filePath
    })
  } catch (error: any) {
    console.error('Get Upload URL Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}