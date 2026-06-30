import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mail'
import { maiListensReplyEmail } from '@/lib/email-templates'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const paramsId = (await params).id;
    const { data: submission, error } = await supabase
      .from('mai_listens')
      .select('*')
      .eq('id', paramsId)
      .single()

    if (error || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({ submission })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const paramsId = (await params).id;
    const { reply } = await req.json()

    const { data: submission, error: fetchError } = await supabase
      .from('mai_listens')
      .select('full_name, email')
      .eq('id', paramsId)
      .single()

    if (fetchError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    if (!submission.email) {
      return NextResponse.json({ error: 'No email address for this submitter' }, { status: 400 })
    }

    // Update reply in DB and mark as resolved
    const { error: updateError } = await supabase
      .from('mai_listens')
      .update({
        admin_reply: reply,
        admin_reply_at: new Date().toISOString(),
        status: 'resolved',
      })
      .eq('id', paramsId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Send reply email
    await sendMail({
      to: submission.email,
      subject: 'Response to Your MAI Listens Submission',
      html: maiListensReplyEmail(submission.full_name, reply),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}