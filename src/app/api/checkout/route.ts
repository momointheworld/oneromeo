import { generateSecureDownloadToken } from '@/utils/generateSecureDownloadToken'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z
    .object({
        priceId: z
            .string()
            .min(1, 'You need to select a service or product first!'),
        email: z.string().email('please enter a valid email address'),
        timeZone: z.string().optional(),
        date: z.string().optional(),
        timeSlot: z.string().optional(),
        couponCode: z.string().optional(), // Added couponCode field
    })
    .superRefine((data, ctx) => {
        const exemptProductId = ebookPriceId

        if (data.priceId.trim() !== exemptProductId) {
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
            console.log('Exempt product - skipping optional field validation')
        }
    })

const stripeInstance = require('stripe')(process.env.STRIPE_SECRET_KEY)
const singleSessionPriceId = process.env.NEXT_PUBLIC_SINGLE_SESSION_PRICEID
const bundlePriceId = process.env.NEXT_PUBLIC_BUNDLE_PRICEID
const ebookPriceId = process.env.NEXT_PUBLIC_EBOOK_PRICEID

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
        const couponCodeError = flattenedErrors.fieldErrors.couponCode || [] // Added couponCodeError
        console.log('Flattened Errors:', flattenedErrors.fieldErrors)

        return new Response(
            JSON.stringify({
                errors: {
                    emailError,
                    dateError,
                    timezoneError,
                    timeSlotError,
                    couponCodeError, // Added couponCodeError
                },
            }),
            {
                status: 400,
            }
        )
    }

    // Proceed with creating checkout session
    try {
        const { priceId, email, timeZone, date, timeSlot, couponCode } = body
        console.log('Request Body:', {
            priceId,
            email,
            timeZone,
            date,
            timeSlot,
            couponCode,
        })

        // Define the promotionCodeId within a block scope
        let promotionCodeId: string | null = null

        if (body.couponCode) {
            const promotionCodes = await stripeInstance.promotionCodes.list({
                active: true,
                code: body.couponCode,
            })
            console.log('Stripe Promotion Codes:', promotionCodes.data)

            promotionCodeId =
                promotionCodes.data.length > 0
                    ? promotionCodes.data[0].id
                    : null

            if (!promotionCodeId) {
                // Add an error to the couponCodeError array
                const couponCodeError = ['Invalid coupon code']

                return new Response(
                    JSON.stringify({
                        errors: {
                            couponCodeError,
                        },
                    }),
                    { status: 400 }
                )
            }
        }

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

        // const adjustableQuantityPriceId = singleSessionPriceId

        const lineItems = [
            {
                price: priceId,
                adjustable_quantity:
                    priceId === singleSessionPriceId
                        ? { enabled: true, minimum: 1, maximum: 4 }
                        : undefined,
                quantity: 1,
            },
        ]

        // Mapping of coupon codes to promotion code IDs from environment variables
        const couponToPromotionCodeMap: { [key: string]: string } = {
            QUIZ24: process.env.COUPON_CODE_QUIZ24 || '',
            // Add more mappings as needed
        }

        // Lookup the promotion code ID from the coupon code
        const promotionCode = couponCode
            ? couponToPromotionCodeMap[couponCode]
            : null

        console.log('Mapped Promotion Code:', promotionCode)

        const discounts =
            priceId === singleSessionPriceId &&
            (promotionCode || promotionCodeId)
                ? [{ promotion_code: promotionCode || promotionCodeId }] // Use the mapped promotion code ID
                : []

        let successUrl = `http://localhost:3000/confirmation?success=true&session_id={CHECKOUT_SESSION_ID}&date=${date}&timeSlot=${timeSlot}&timeZone=${timeZone}&email=${email}`
        if (priceId === ebookPriceId) {
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
            discounts: discounts,
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
