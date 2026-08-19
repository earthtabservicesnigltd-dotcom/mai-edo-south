// app/api/testimonials/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = supabaseAdmin()
    const { data, error } = await supabase
      .from('video_testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ testimonials: data || [] }) // Ensure it's always an array
  } catch (error: any) {
    return NextResponse.json({ testimonials: [] }, { status: 500 }) // Return empty array on error
  }
}