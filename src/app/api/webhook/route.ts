import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { addAppointment } from '@/actions'
import { isEventProcessed, logProcessedEvent } from '@/actions/eventhelper'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export const config = {
    api: {
        bodyParser: false, // Disable the built-in body parser
    },
}

// Convert a ReadableStream to a Node.js Readable Stream
async function streamToBuffer(
    stream: ReadableStream<Uint8Array>
): Promise<Buffer> {
    const reader = stream.getReader()
    const chunks: Uint8Array[] = []
    let done = false

    while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
            chunks.push(value)
        }
    }

    return Buffer.concat(chunks)
}

export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature') as string
    let event

    try {
        // Convert the ReadableStream to Node.js Buffer
        const buf = await streamToBuffer(req.body as ReadableStream<Uint8Array>)
        event = stripe.webhooks.constructEvent(
            buf,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        console.error('Error verifying Stripe webhook signature:', err)
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        )
    }

    // Add debugging logs
    console.log('Received event:', event.type)

    // Check if the event has already been processed
    if (await isEventProcessed(event.id)) {
        console.log(`Event ${event.id} has already been processed.`)
        return NextResponse.json(
            { message: 'Event already processed' },
            { status: 200 }
        )
    }

    // Log the event as processed
    await logProcessedEvent(event.id)

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.metadata) {
            const {
                appointment_date,
                appointment_timeSlot,
                appointment_timeZone,
            } = session.metadata as {
                appointment_date: string
                appointment_timeSlot: string
                appointment_timeZone: string
            }

            const [thTimeSlot, csrTimeSlot] = appointment_timeSlot.split(';')
            const date = new Date(`${appointment_date}`)

            // Add the appointment
            try {
                await addAppointment({
                    timeZone: appointment_timeZone,
                    date: date,
                    thTimeSlot,
                    csrTimeSlot,
                    email: session.customer_email || '',
                })
                console.log('Appointment created')
            } catch (error: unknown) {
                console.error('Error adding appointment:', error)
                return NextResponse.json(
                    { error: 'Error adding appointment' },
                    { status: 500 }
                )
            }
        } else {
            console.warn('No metadata found on session')
        }
    } else {
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
