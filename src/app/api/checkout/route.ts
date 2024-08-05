import { generateSecureDownloadToken } from '@/utils/generateSecureDownloadToken'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
// Define the Zod schema with validation
const schema = z
    .object({
        priceId: z
            .string()
            .min(1, 'You need to select a service or product first!'),
        email: z.string().email('(please enter a valid email address'),
        timeZone: z.string().optional(),
        date: z.string().optional(),
        timeSlot: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        const exemptProductId = 'price_1PffWVHcOAKxyg1ZcYyxKX8U'

        if (data.priceId.trim() !== exemptProductId) {
            // Only validate if priceId is not exempt
            if (!data.timeZone) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['timeZone'],
                    message: 'please make a selection',
                })
            }
            if (!data.date) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['date'],
                    message: 'please make a selection',
                })
            }
            if (!data.timeSlot) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['timeSlot'],
                    message: 'please make a selection',
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

        let successUrl = `http://localhost:3000/confirmation?success=true&session_id={CHECKOUT_SESSION_ID}&date=${date}&timeSlot=${timeSlot}&timeZone=${timeZone}&email=${email}`
        if (priceId === 'price_1PffWVHcOAKxyg1ZcYyxKX8U') {
            // Generate a token for the ebook
            const token = await generateSecureDownloadToken(email) // Implement this function as needed
            successUrl += `&token=${token}`
        }

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
            customer_creation: 'always', // Ensure a new customer object is created
            // success_url: `http://localhost:3000/confirmation?success=true&session_id={CHECKOUT_SESSION_ID}&date=${date}&timeSlot=${timeSlot}&timeZone=${timeZone}&email=${email}`,
            success_url: successUrl,
            cancel_url: 'http://localhost:3000/',
        })

        return NextResponse.json({ url: session.url })
    } catch (err: any) {
        console.error('Error creating checkout session:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
