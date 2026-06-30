import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()

    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: name ?? '' },
        listIds: [5],
        updateEnabled: true,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      // Brevo returns 204 on duplicate so this mostly catches real errors
      return NextResponse.json({ error: err.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Subscribe error:', err.message)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}