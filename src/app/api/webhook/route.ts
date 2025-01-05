import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import {
    addAppointment,
    findTokenByEmail,
    saveTokenToDatabase,
} from '@/actions'
import { isEventProcessed, logProcessedEvent } from '@/actions/eventHelper'
import { findAppointmentByEmailAndDate } from '@/actions/findAppointmentByEmailAndDate'
import createCustomerPortalSession from '@/actions/createCustomerPortalSession'
import { generateSecureDownloadToken } from '@/utils/generateSecureDownloadToken'
import { storeCustomerDetailsForLaterReview } from '@/utils/storeCustomerDetailsForLaterReview'
import { log } from 'console'

export const runtime = 'nodejs'
export const preferredRegion = 'auto'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

interface CheckAppointmentProps {
    session: Stripe.Checkout.Session
    thDate: string
    thTime: string
    csrDate: string
    csrTime: string
    utcDate: string
    utcTime: string
    csrTimeZone: string
    createdAt: Date
}

const handleAppointment = async ({
    session,
    thDate,
    thTime,
    csrDate,
    csrTime,
    utcDate,
    utcTime,
    csrTimeZone,
    createdAt,
}: CheckAppointmentProps) => {
    if (session?.customer_email) {
        const existingAppointment = await findAppointmentByEmailAndDate(
            session.customer_email,
            createdAt
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
                csrTimeZone,
                thDate,
                thTime,
                csrDate,
                csrTime,
                utcDate,
                utcTime,
                email: session.customer_email,
                createdAt,
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
        session.metadata.appointment_date_time &&
        session.metadata.th_date_time &&
        session.metadata.utc_date_time &&
        session.metadata.csrTimeZone
    ) {
        const {
            appointment_date_time,
            th_date_time,
            utc_date_time,
            csrTimeZone,
        } = session.metadata as {
            appointment_date_time: string
            th_date_time: string
            utc_date_time: string
            csrTimeZone: string
        }
        // Extract the customer ID from the session
        const customer = session.customer_details
        const customerId = session.customer ? session.customer.toString() : null
        const customerDetails = session.customer_details
        console.log('Customer details:', customerDetails)
        console.log(`customer: ${customer}`)
        console.log(`customerID: ${customerId}`)

        const thTime = th_date_time
            .split('T')[1]
            .split(':')
            .slice(0, 2)
            .join(':')
        const csrTime = appointment_date_time
            .split('T')[1]
            .split(':')
            .slice(0, 2)
            .join(':')
        const utcTime = utc_date_time
            .split('T')[1]
            .split(':')
            .slice(0, 2)
            .join(':')

        if (!customerId) {
            console.warn('No customer ID found in session')
            return
        }

        const localDate = new Date()
        const userTimezoneOffset = localDate.getTimezoneOffset() // Gets the user's local timezone offset in minutes
        const utcCreatedAt = new Date(
            localDate.getTime() + userTimezoneOffset * 60 * 1000
        )

        await handleAppointment({
            session,
            thDate: th_date_time,
            thTime,
            csrDate: appointment_date_time,
            csrTime,
            utcDate: utc_date_time,
            utcTime,
            csrTimeZone,
            // Convert the current local time to UTC before saving
            createdAt: utcCreatedAt,
        })
    } else {
        console.warn('Required metadata not found in session')
        // Generate a secure download token for the ebook
        const email = session.customer_email || 'guest@example.com'
        const token = await generateSecureDownloadToken(email)
        // Check if a token already exists for this email
        const existingToken = await findTokenByEmail(email)
        if (existingToken) {
            console.log('Token already exists:', existingToken.token)
            return
        }
        // Store the token and associated email in your database
        await saveTokenToDatabase(email, token)
        // Generate the download URL
        // const downloadUrl = `https://oneromeo.com/confirmation?success=true&session_id=${session.id}&token=${token}`
        const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}?success=true&session_id=${session.id}&token=${token}`
        console.log('Download URL:', downloadUrl)
    }
    // Extract product details from line items
    // const lineItems = session.line_items?.data || []
    // if (lineItems.length > 0) {
    //     const firstLineItem = lineItems[0]
    //     const productId =
    //         firstLineItem.price && typeof firstLineItem.price === 'string'
    //             ? firstLineItem.price
    //             : 'Unknown Product'
    //     const productName = firstLineItem.description || 'Unknown Product'
    //     // const quantity = firstLineItem.quantity
    //     // const amountTotal = firstLineItem.amount_total

    //     console.log(`Product ID: ${productId}`)
    //     console.log(`Product Name: ${productName}`)
    // console.log(`Quantity: ${quantity}`)
    // console.log(`Total Amount: ${amountTotal / 100} USD`)

    // // Extract the customer ID from the session
    // const customerId = session.customer ? session.customer.toString() : null
    // if (!customerId) {
    //     console.warn('No customer ID found in session')
    //     return
    // }

    // Store customer details for later review
    // await storeCustomerDetailsForLaterReview(customerId, productId)
}

async function streamToBuffer(readableStream: ReadableStream<Uint8Array>) {
    const reader = readableStream.getReader()
    const chunks: Uint8Array[] = []
    let result = await reader.read()

    while (!result.done) {
        chunks.push(result.value)
        result = await reader.read()
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
                // Ensure line_items is expanded
                const lineItems = session.line_items?.data || []
                console.log('Line Items:', lineItems)
                // // Check if line_items array has items
                if (lineItems.length > 0) {
                    const firstLineItem = lineItems[0]
                    // // Add checks to ensure firstLineItem and its properties are defined
                    const productId =
                        firstLineItem.price?.id || 'Unknown Product'
                    const productName =
                        firstLineItem.description || 'Unknown Product'
                    console.log(`Product ID: ${productId}`)
                    console.log(`Product Name: ${productName}`)

                    // Create a customer portal session after handling checkout
                    const customerId = session.customer
                        ? session.customer.toString()
                        : null
                    if (customerId) {
                        await createCustomerPortalSession(customerId)
                        await storeCustomerDetailsForLaterReview(
                            customerId,
                            productId
                        )
                        console.log(
                            'Customer and product details stored successfully!'
                        )
                    }
                }
            }
            break
        // Add other cases as needed
        default:
            console.log(`Unhandled event type ${event.type}`)
            break
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
