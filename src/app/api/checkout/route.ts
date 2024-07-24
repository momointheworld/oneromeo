// import { NextRequest, NextResponse } from 'next/server'

// const stripeInstance = require('stripe')(process.env.STRIPE_SECRET_KEY)

// export async function POST(req: NextRequest, res: NextResponse) {
//     const body = await req.json()
//     try {
//         const { priceId, email, timeZone, date, timeSlot } = body
//         const session = await stripeInstance.checkout.sessions.create({
//             payment_method_types: ['card', 'alipay'],
//             line_items: [
//                 {
//                     price: priceId,
//                     quantity: 1,
//                 },
//             ],
//             custom_fields: [
//                 {
//                     key: 'appointment_date',
//                     label: {
//                         type: 'custom',
//                         custom: 'Appointment Date',
//                     },
//                     type: 'text',
//                     text: {
//                         default_value: date,
//                     },
//                 },
//                 {
//                     key: 'appointment_timeSlot',
//                     label: {
//                         type: 'custom',
//                         custom: 'Time Slot',
//                     },
//                     type: 'text',
//                     text: {
//                         default_value: timeSlot,
//                     },
//                 },
//                 {
//                     key: 'appointment_timeZone',
//                     label: {
//                         type: 'custom',
//                         custom: 'Appointment TimeZone',
//                     },
//                     type: 'text',
//                     text: {
//                         default_value: timeZone,
//                     },
//                 },
//             ],
//             metadata: {
//                 appointment_date: date,
//                 appointment_timeSlot: timeSlot,
//                 appointment_timeZone: timeZone,
//             },
//             mode: 'payment',
//             customer_email: email,
//             success_url: `http://localhost:3000/confirmation?success=true&session_id={CHECKOUT_SESSION_ID}&date=${date}&timeSlot=${timeSlot}&timeZone=${timeZone}&email=${email}`,
//             cancel_url: 'http://localhost:3000/',
//         })
//         return NextResponse.json({ url: session.url })
//     } catch (err) {
//         console.error('Error creating checkout session:', err)
//         return NextResponse.json({ error: err }, { status: 500 })
//     }
// }
import { NextRequest, NextResponse } from 'next/server'

const stripeInstance = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json()
    try {
        const { priceId, email, timeZone, date, timeSlot } = body

        const customFields = []
        if (date) {
            customFields.push({
                key: 'appointment_date',
                label: {
                    type: 'custom',
                    custom: 'Appointment Date',
                },
                type: 'text',
                text: {
                    default_value: date,
                },
            })
        }
        if (timeSlot) {
            customFields.push({
                key: 'appointment_timeSlot',
                label: {
                    type: 'custom',
                    custom: 'Time Slot',
                },
                type: 'text',
                text: {
                    default_value: timeSlot,
                },
            })
        }
        if (timeZone) {
            customFields.push({
                key: 'appointment_timeZone',
                label: {
                    type: 'custom',
                    custom: 'Appointment TimeZone',
                },
                type: 'text',
                text: {
                    default_value: timeZone,
                },
            })
        }

        const metadata = {
            appointment_date: date || '',
            appointment_timeSlot: timeSlot || '',
            appointment_timeZone: timeZone || '',
        }

        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card', 'alipay'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            custom_fields: customFields,
            metadata,
            mode: 'payment',
            customer_email: email,
            success_url: `http://localhost:3000/confirmation?success=true&session_id={CHECKOUT_SESSION_ID}&date=${date}&timeSlot=${timeSlot}&timeZone=${timeZone}&email=${email}`,
            cancel_url: 'http://localhost:3000/',
        })
        return NextResponse.json({ url: session.url })
    } catch (err) {
        console.error('Error creating checkout session:', err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}
