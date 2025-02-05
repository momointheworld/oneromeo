// utils/email.ts

import nodemailer from 'nodemailer'

export function createMailer() {
    const { MAIL, PASS } = process.env

    if (!MAIL || !PASS) {
        throw new Error('Missing email environment variables')
    }

    return nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
            user: MAIL,
            pass: PASS,
        },
    })
}

export async function sendEmail(to: string, subject: string, text: string) {
    const transport = createMailer()

    const mailOptions = {
        from: `"${process.env.MAIL_DISPLAY_NAME}" <${process.env.MAIL}>`,
        to,
        subject,
        text,
    }

    try {
        const info = await transport.sendMail(mailOptions)
        return info
    } catch (err: any) {
        throw new Error(`Error sending email: ${err.message}`)
    }
}
