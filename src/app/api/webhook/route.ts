// import Stripe from 'stripe'
// import { NextRequest, NextResponse } from 'next/server'
// import { addAppointment } from '@/actions'
// import { isEventProcessed, logProcessedEvent } from '@/actions/eventhelper'
// import { findAppointmentByEmailAndDate } from '@/actions/findAppointmentByEmailAndDate'
// // Add the new segment config
// export const runtime = 'nodejs'
// export const preferredRegion = 'auto' // or specify a region if needed

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// interface CheckAppointmentProps {
//     session: Stripe.Checkout.Session
//     date: Date
//     appointment_timeZone: string
//     thTimeSlot: string
//     csrTimeSlot: string
// }

// // Example function where this code might be used
// export const handleAppointment = async ({
//     session,
//     date,
//     appointment_timeZone,
//     thTimeSlot,
//     csrTimeSlot,
// }: CheckAppointmentProps) => {
//     if (session?.customer_email) {
//         // Check if the appointment already exists
//         const existingAppointment = await findAppointmentByEmailAndDate(
//             session.customer_email,
//             date
//         )

//         if (existingAppointment) {
//             console.log('Appointment already exists:', existingAppointment)
//             return NextResponse.json(
//                 { message: 'Appointment already exists' },
//                 { status: 200 }
//             )
//         }

//         // Add the appointment
//         try {
//             await addAppointment({
//                 timeZone: appointment_timeZone,
//                 date: date,
//                 thTimeSlot,
//                 csrTimeSlot,
//                 email: session.customer_email,
//             })
//             console.log('Appointment created')
//             return NextResponse.json(
//                 { message: 'Appointment created successfully' },
//                 { status: 201 }
//             )
//         } catch (error: unknown) {
//             console.error('Error adding appointment:', error)
//             return NextResponse.json(
//                 { error: 'Error adding appointment' },
//                 { status: 500 }
//             )
//         }
//     } else {
//         console.warn('No metadata found on session')
//         return NextResponse.json(
//             { error: 'No customer email found in session' },
//             { status: 400 }
//         )
//     }
// }

// async function handleCheckoutSessionCompleted(
//     session: Stripe.Checkout.Session
// ) {
//     if (session.metadata) {
//         const { appointment_date, appointment_timeSlot, appointment_timeZone } =
//             session.metadata as {
//                 appointment_date: string
//                 appointment_timeSlot: string
//                 appointment_timeZone: string
//             }

//         const [thTimeSlot, csrTimeSlot] = appointment_timeSlot.split(';')
//         const date = new Date(`${appointment_date}T00:00:00Z`)
//         handleAppointment({
//             session,
//             date,
//             appointment_timeZone,
//             thTimeSlot,
//             csrTimeSlot,
//         })
//     } else {
//         console.warn('No metadata found on session')
//     }
// }

// // Convert a ReadableStream to a Node.js Readable Stream
// async function streamToBuffer(
//     stream: ReadableStream<Uint8Array>
// ): Promise<Buffer> {
//     const reader = stream.getReader()
//     const chunks: Uint8Array[] = []
//     let done = false

//     while (!done) {
//         const { value, done: doneReading } = await reader.read()
//         done = doneReading
//         if (value) {
//             chunks.push(value)
//         }
//     }

//     return Buffer.concat(chunks)
// }

// export async function POST(req: NextRequest) {
//     const sig = req.headers.get('stripe-signature') as string
//     let event
//     let processedEvents = new Set()

//     try {
//         // Convert the ReadableStream to Node.js Buffer
//         const buf = await streamToBuffer(req.body as ReadableStream<Uint8Array>)
//         event = stripe.webhooks.constructEvent(
//             buf,
//             sig,
//             process.env.STRIPE_WEBHOOK_SECRET!
//         )
//     } catch (err: any) {
//         console.error('Error verifying Stripe webhook signature:', err)
//         return NextResponse.json(
//             { error: `Webhook Error: ${err.message}` },
//             { status: 400 }
//         )
//     }

//     // Check if the event has already been processed
//     if (processedEvents.has(event.id)) {
//         return NextResponse.json(
//             { message: 'Event already processed' },
//             { status: 200 }
//         )
//     }

//     // Add debugging logs
//     console.log('Received event:', event.type)

//     // Check if the event has already been processed
//     if (await isEventProcessed(event.id)) {
//         console.log(`Event ${event.id} has already been processed.`)
//         return NextResponse.json(
//             { message: 'Event already processed' },
//             { status: 200 }
//         )
//     }

//     // Log the event as processed
//     await logProcessedEvent(event.id)

//     switch (event.type) {
//         case 'checkout.session.completed':
//             {
//                 const session = event.data.object as Stripe.Checkout.Session
//                 await handleCheckoutSessionCompleted(session)
//             }
//             break
//         default:
//             console.log(`Unhandled event type ${event.type}`)
//             break
//     }
//     return NextResponse.json({ received: true }, { status: 200 })
// }

import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { addAppointment } from '@/actions'
import { isEventProcessed, logProcessedEvent } from '@/actions/eventhelper'
import { findAppointmentByEmailAndDate } from '@/actions/findAppointmentByEmailAndDate'

export const runtime = 'nodejs'
export const preferredRegion = 'auto'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

interface CheckAppointmentProps {
    session: Stripe.Checkout.Session
    date: Date
    appointment_timeZone: string
    thTimeSlot: string
    csrTimeSlot: string
}

export const handleAppointment = async ({
    session,
    date,
    appointment_timeZone,
    thTimeSlot,
    csrTimeSlot,
}: CheckAppointmentProps) => {
    if (session?.customer_email) {
        const existingAppointment = await findAppointmentByEmailAndDate(
            session.customer_email,
            date
        )

        if (existingAppointment) {
            console.log('Appointment already exists:', existingAppointment)
            return NextResponse.json(
                { message: 'Appointment already exists' },
                { status: 200 }
            )
        }

        try {
            await addAppointment({
                timeZone: appointment_timeZone,
                date: date,
                thTimeSlot,
                csrTimeSlot,
                email: session.customer_email,
            })
            console.log('Appointment created')
            return NextResponse.json(
                { message: 'Appointment created successfully' },
                { status: 201 }
            )
        } catch (error: unknown) {
            console.error('Error adding appointment:', error)
            return NextResponse.json(
                { error: 'Error adding appointment' },
                { status: 500 }
            )
        }
    } else {
        console.warn('No customer email found in session')
        return NextResponse.json(
            { error: 'No customer email found in session' },
            { status: 400 }
        )
    }
}

async function handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
) {
    if (
        session.metadata &&
        session.metadata.appointment_date &&
        session.metadata.appointment_timeSlot &&
        session.metadata.appointment_timeZone
    ) {
        const { appointment_date, appointment_timeSlot, appointment_timeZone } =
            session.metadata as {
                appointment_date: string
                appointment_timeSlot: string
                appointment_timeZone: string
            }

        let [thTimeSlot, csrTimeSlot] = appointment_timeSlot.split(' (')
        csrTimeSlot = csrTimeSlot.replace(')', '')

        const date = new Date(`${appointment_date}T00:00:00Z`)
        await handleAppointment({
            session,
            date,
            appointment_timeZone,
            thTimeSlot,
            csrTimeSlot,
        })
    } else {
        console.warn('Required metadata not found in session')
    }
}

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
    let processedEvents = new Set()

    try {
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

    if (processedEvents.has(event.id)) {
        return NextResponse.json(
            { message: 'Event already processed' },
            { status: 200 }
        )
    }

    console.log('Received event:', event.type)

    if (await isEventProcessed(event.id)) {
        console.log(`Event ${event.id} has already been processed.`)
        return NextResponse.json(
            { message: 'Event already processed' },
            { status: 200 }
        )
    }

    await logProcessedEvent(event.id)

    switch (event.type) {
        case 'checkout.session.completed':
            {
                const session = event.data.object as Stripe.Checkout.Session
                await handleCheckoutSessionCompleted(session)
            }
            break
        default:
            console.log(`Unhandled event type ${event.type}`)
            break
    }
    return NextResponse.json({ received: true }, { status: 200 })
}
