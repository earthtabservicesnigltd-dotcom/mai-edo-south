interface MailOptions {
  to: string
  subject: string
  html: string
}

export async function sendMail({ to, subject, html }: MailOptions) {
  const apiKey = process.env.BREVO_API_KEY

  if (!apiKey) {
    console.error('Email error: BREVO_API_KEY is not defined in environment variables.')
    return
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'MAI Edo South Campaign',
          email: 'noreply@mai4senate.com',
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      // This will print the EXACT error reason from Brevo (e.g. Account suspended, domain unverified)
      console.log('Brevo API Refusal Details:', JSON.stringify(data))
      throw new Error(data.message || 'Brevo API call failed')
    }

    console.log('Email sent successfully via Brevo HTTP API! Message ID:', data.messageId)
  } catch (err: any) {
    console.error('Mail trigger failed:', err.message)
    throw err
  }
}