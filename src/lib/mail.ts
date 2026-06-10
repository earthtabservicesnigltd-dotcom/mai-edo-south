import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface MailOptions {
  to: string
  subject: string
  html: string
}

export async function sendMail({ to, subject, html }: MailOptions) {
  console.log('Sending email to:', to)
  console.log('SMTP Host:', process.env.SMTP_HOST)
  console.log('SMTP Port:', process.env.SMTP_PORT)
  console.log('SMTP User:', process.env.SMTP_USER)

  try {
    const result = await transporter.sendMail({
      from: `MAI Edo South Campaign <noreply@mai4senate.com>`,
      to,
      subject,
      html,
    })
    console.log('Email sent:', result.messageId)
  } catch (err: any) {
    console.log('SMTP Error:', err.message)
    throw err
  }
}