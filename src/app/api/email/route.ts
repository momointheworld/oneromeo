import { type NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { z } from 'zod'

// Define the Zod schema
const zodSchema = z.object({
    email: z.string().email({ message: 'Please provide a valid email!' }),
    name: z
        .string()
        .min(1, { message: 'Name must be at least 2 characters long.' }),
    description: z.string().min(5, {
        message: 'Description must be at least 5 characters longer.',
    }),
})

export async function POST(request: NextRequest, response: NextResponse) {
    // Parse and validate the request body
    const body = await request.json()
    const parsedBody = zodSchema.safeParse(body)

    if (!parsedBody.success) {
        return NextResponse.json(
            { errors: parsedBody.error.flatten().fieldErrors },
            { status: 400 }
        )
    }

    const { email, name, description } = parsedBody.data

    const MAIL = process.env.MAIL
    const PASS = process.env.PASS
    const RECEIVER = process.env.RECEIVER

    if (!MAIL || !PASS || !RECEIVER) {
        return NextResponse.json(
            { error: 'Missing environment variables' },
            { status: 500 }
        )
    }

    const transport = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
            user: MAIL,
            pass: PASS,
        },
    })

    const mailOptions: Mail.Options = {
        from: MAIL,
        to: RECEIVER,
        subject: `Message from ${name} (${email})`,
        text: description,
    }

    try {
        const info = await transport.sendMail(mailOptions)
        console.log('Email sent:', info.response)
        return NextResponse.json({ message: 'Email sent' })
    } catch (err: any) {
        console.error('Error sending email:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
