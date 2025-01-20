import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/utils/email' // Import sendEmail

const zodSchema = z.object({
    email: z.string().email({ message: 'Please provide a valid email!' }),
    name: z
        .string()
        .min(1, { message: 'Name must be at least 2 characters long.' }),
    description: z.string().min(5, {
        message: 'Description must be at least 5 characters long.',
    }),
})

export async function POST(request: NextRequest) {
    const body = await request.json()
    const parsedBody = zodSchema.safeParse(body)

    if (!parsedBody.success) {
        return NextResponse.json(
            { errors: parsedBody.error.flatten().fieldErrors },
            { status: 400 }
        )
    }

    const { email, name, description } = parsedBody.data
    const { RECEIVER } = process.env

    if (!RECEIVER) {
        return NextResponse.json(
            { error: 'Missing receiver email environment variable' },
            { status: 500 }
        )
    }

    const subject = `Message from ${name} (${email})`
    const text = description

    try {
        const info = await sendEmail(RECEIVER, subject, text)
        return NextResponse.json({ message: 'Email sent' })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
