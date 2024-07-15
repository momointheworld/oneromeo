// src/app/api/checkout/route.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'

const stripeInstance = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json()
    try {
        const { priceId, email, timeZone, date, timeSlot } = body
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card', 'alipay'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            custom_fields: [
                {
                    key: 'appointment_date',
                    label: {
                        type: 'custom',
                        custom: 'Appointment Date',
                    },
                    type: 'text',
                    text: {
                        default_value: date,
                    },
                },
                {
                    key: 'appointment_timeSlot',
                    label: {
                        type: 'custom',
                        custom: 'Appointment Time Slot',
                    },
                    type: 'text',
                    text: {
                        default_value: timeSlot,
                    },
                },
                {
                    key: 'appointment_timeZone',
                    label: {
                        type: 'custom',
                        custom: 'Appointment Time Zone',
                    },
                    type: 'text',
                    text: {
                        default_value: timeZone,
                    },
                },
            ],
            metadata: {
                appointment_date: date,
                appointment_timeSlot: timeSlot,
                appointment_timeZone: timeZone,
            },
            mode: 'payment',
            customer_email: email,
            success_url:
                'http://localhost:3000/confirmation?success=true&session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/confirmation?canceled=true',
        })
        return NextResponse.json({ url: session.url })
    } catch (err) {
        console.error('Error creating checkout session:', err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}
