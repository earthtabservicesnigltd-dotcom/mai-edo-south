import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, password, courseSlug } = await req.json()

    if (!firstName || !lastName || !email || !phone || !password || !courseSlug) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const admin = supabaseAdmin()

    // ── Look up the course first ──
    const { data: course } = await admin
      .from('academy_courses')
      .select('id, title, school_slug, school_order_index')
      .eq('slug', courseSlug)
      .single()

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // ── Create the auth user ──
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName, phone },
    })

    if (createError || !created?.user) {
      return NextResponse.json(
        { error: createError?.message || 'Could not create account.' },
        { status: 400 }
      )
    }

    const userId = created.user.id

    // ── Generate student ID ──
    const year = new Date().getFullYear()
    const { data: lastProfile } = await admin
      .from('profiles')
      .select('student_id')
      .like('student_id', `MAI/ACA/STUD/${year}/%`)
      .order('student_id', { ascending: false })
      .limit(1)

    const lastNum = lastProfile?.[0]?.student_id
      ? parseInt(lastProfile[0].student_id.split('/').pop() || '0')
      : 0

    const studentId = `MAI/ACA/STUD/${year}/${String(lastNum + 1).padStart(6, '0')}`

    // ── Save profile ──
    await admin
      .from('profiles')
      .upsert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        student_id: studentId,
      }, { onConflict: 'id' })

    // ── Enroll in course ──
    const { error: enrollError } = await admin
      .from('academy_enrollments')
      .upsert({ user_id: userId, course_id: course.id }, { onConflict: 'user_id,course_id' })

    if (enrollError) {
      await admin.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: enrollError.message }, { status: 500 })
    }

    // ── Welcome email ──
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mai4senate.com'}/api/auth/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, courseTitle: course?.title }),
      })
    } catch {}

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
