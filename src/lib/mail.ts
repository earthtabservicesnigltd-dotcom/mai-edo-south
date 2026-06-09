import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for port 465
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
  await transporter.sendMail({
    from: `MAI Edo South Campaign <noreply@mai4senate.com>`,
    to,
    subject,
    html,
  })
}