// import { NextApiRequest, NextApiResponse } from 'next'
// import Stripe from 'stripe'

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method === 'POST') {
//         try {
//             // Create Checkout Sessions from body params.
//             const session = await stripe.checkout.sessions.create({
//                 line_items: [
//                     {
//                         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//                         price: '{{PRICE_ID}}',
//                         quantity: 1,
//                     },
//                 ],
//                 mode: 'payment',
//                 success_url: `${req.headers.origin}/?success=true`,
//                 cancel_url: `${req.headers.origin}/?canceled=true`,
//             })
//             res.redirect(303, session.url) // Redirect to the Stripe session URL
//         } catch (err) {
//             if (err instanceof Stripe.errors.StripeError) {
//                 // Handle Stripe-specific errors
//                 res.status(err.statusCode || 500).json({ message: err.message })
//             } else if (err instanceof Error) {
//                 // Handle other errors
//                 res.status(500).json({ message: err.message })
//             } else {
//                 // Handle unexpected errors
//                 res.status(500).json({
//                     message: 'An unexpected error occurred',
//                 })
//             }
//         }
//     } else {
//         res.setHeader('Allow', 'POST')
//         res.status(405).end('Method Not Allowed')
//     }
// }

import { NextApiRequest, NextApiResponse } from 'next'

const stripe = require('stripe')(process.env.STRIPE_SECRET)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // Destructure the necessary fields from req.body
        const { date, timeSlot, item, email } = req.body
        const session = await stripe.checkout.sessions.create({
            // One product only
            line_items: [
                {
                    price: item.productPriceId,
                    quantity:
                        item.productPriceId === 'price_1Nlm1BAlyXyK8wMu9xgoe0G3'
                            ? item.quantity
                            : 1,
                    adjustable_quantity:
                        item.productPriceId === 'price_1Nlm1BAlyXyK8wMu9xgoe0G3'
                            ? {
                                  enabled: true,
                                  minimum: 1,
                                  maximum: 10,
                              }
                            : undefined,
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
                        value: date,
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
                        value: timeSlot,
                    },
                },
            ],
            metadata: {
                appointment_date: date,
                appointment_timeSlot: timeSlot,
            },
            mode: 'payment',
            customer_email: email,
            success_url:
                'http://localhost:3000/confirmation?success=true&session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/confirmation?canceled=true',
        })
        // response.redirect(303, session.url); //Redirect does not work in Dev stage
        res.json({ url: session.url })
    } catch (error) {
        console.error('Error creating checkout session:', error)
        res.status(500).send(
            'An error occurred while creating the checkout session.'
        )
    }
}
