import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
// Define the Zod schema with validation
const schema = z
    .object({
        priceId: z.string().min(1, 'Choose a coffee or ebook please.'),
        email: z.string().email('Invalid email address.'),
        timeZone: z.string().optional(),
        date: z.string().optional(),
        timeSlot: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        const exemptProductId = 'price_1PffWVHcOAKxyg1ZcYyxKX8U'

        console.log('SuperRefine - priceId:', data.priceId) // Log for debugging

        if (data.priceId.trim() !== exemptProductId) {
            // Only validate if priceId is not exempt
            if (!data.timeZone) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['timeZone'],
                    message: 'Select your time zone.',
                })
            }
            if (!data.date) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['date'],
                    message: 'Select an appointment date.',
                })
            }
            if (!data.timeSlot) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['timeSlot'],
                    message: 'Choose your time slot.',
                })
            }
        } else {
            // When exempt, no need to validate optional fields
            console.log('Exempt product - skipping optional field validation')
        }
    })

const stripeInstance = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json()

    // Validate request body
    const parseResult = schema.safeParse(body)

    if (!parseResult.success) {
        // Flatten errors
        const flattenedErrors = parseResult.error.flatten()
        const emailError = flattenedErrors.fieldErrors.email || []
        const timezoneError = flattenedErrors.fieldErrors.timeZone || []
        const dateError = flattenedErrors.fieldErrors.date || []
        const timeSlotError = flattenedErrors.fieldErrors.timeSlot || []
        console.log('Flattened Errors:', flattenedErrors.fieldErrors)

        return new Response(
            JSON.stringify({
                errors: {
                    emailError,
                    dateError,
                    timezoneError,
                    timeSlotError,
                },
            }),
            {
                status: 400,
            }
        )
    }

    console.log('Validation Passed for priceId:', body.priceId.trim()) // Log the priceId if validation passes

    // Proceed with creating checkout session
    try {
        const { priceId, email, timeZone, date, timeSlot } = body

        const customFields = []
        if (date) {
            customFields.push({
                key: 'appointment_date',
                label: { type: 'custom', custom: 'Appointment day' },
                type: 'text',
                text: { default_value: date },
            })
        }
        if (timeSlot) {
            customFields.push({
                key: 'appointment_timeSlot',
                label: {
                    type: 'custom',
                    custom: "Your time (& Arnold's time)",
                },
                type: 'text',
                text: { default_value: timeSlot },
            })
        }
        if (timeZone) {
            customFields.push({
                key: 'appointment_timeZone',
                label: { type: 'custom', custom: 'Your time zone' },
                type: 'text',
                text: { default_value: timeZone },
            })
        }

        const metadata = {
            appointment_date: date || '',
            appointment_timeSlot: timeSlot || '',
            appointment_timeZone: timeZone || '',
        }

        const adjustableQuantityPriceId = 'price_1PckCSHcOAKxyg1Z0WStpNJl'

        const lineItems = [
            {
                price: priceId,
                adjustable_quantity:
                    priceId === adjustableQuantityPriceId
                        ? { enabled: true, minimum: 1, maximum: 4 }
                        : undefined,
                quantity: 1,
            },
        ]

        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card', 'alipay'],
            line_items: lineItems,
            custom_fields: customFields,
            custom_text: {
                submit: { message: '**$1 ≈ HK$ 7.80**' },
            },
            metadata,
            mode: 'payment',
            customer_email: email,
            success_url: `http://localhost:3000/confirmation?success=true&session_id={CHECKOUT_SESSION_ID}&date=${date}&timeSlot=${timeSlot}&timeZone=${timeZone}&email=${email}`,
            cancel_url: 'http://localhost:3000/',
        })

        return NextResponse.json({ url: session.url })
    } catch (err: any) {
        console.error('Error creating checkout session:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
