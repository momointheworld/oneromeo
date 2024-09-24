import { combineDateAndTimeInZone } from '@/utils/combineDateAndTimeInZone'
import { convertToThaiDateTime } from '@/utils/convertToThaiDateTime'
import { convertToUTC } from '@/utils/convertToUTCDateTime'
import { parseDate } from '@internationalized/date'
import { generateSecureDownloadToken } from '@/utils/generateSecureDownloadToken'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { toZonedTime } from 'date-fns-tz'

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
        // const timezoneError = flattenedErrors.fieldErrors.timeZone || []
        const dateError = flattenedErrors.fieldErrors.date || []
        const timeSlotError = flattenedErrors.fieldErrors.timeSlot || []
        const couponCodeError = flattenedErrors.fieldErrors.couponCode || [] // Added couponCodeError
        console.log('Flattened Errors:', flattenedErrors.fieldErrors)

        return new Response(
            JSON.stringify({
                errors: {
                    emailError,
                    dateError,
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
        const { priceId, email, userTimeZone, date, timeSlot, couponCode } =
            body

        const selectedDateObj = new Date(date.year, date.month - 1, date.day)

        const selectedDateValue = parseDate(date)

        const { thaiDate, thaiTime } = convertToThaiDateTime(
            selectedDateValue,
            timeSlot,
            userTimeZone
        )

        const { utcDate, utcTime } = convertToUTC(date, timeSlot, userTimeZone)

        // 1. Thai Date (Asia/Bangkok)
        const combinedThaiDate = combineDateAndTimeInZone(
            thaiDate,
            thaiTime,
            'Asia/Bangkok'
        )

        // 2. CSR Date (Local Timezone - user's timezone)
        const combinedCsrDate = combineDateAndTimeInZone(
            selectedDateObj,
            timeSlot,
            userTimeZone
        )

        // 3. UTC Date (UTC timezone)
        const combinedUtcDate = combineDateAndTimeInZone(
            utcDate,
            utcTime,
            'UTC'
        )

        console.log('Request Body:', {
            priceId,
            email,
            userTimeZone,
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
        if (combinedCsrDate) {
            customFields.push({
                key: 'appointment_date_time',
                label: { type: 'custom', custom: 'Appointment day' },
                type: 'text',
                text: { default_value: combinedCsrDate },
            })
        }
        if (combinedThaiDate) {
            customFields.push({
                key: 'th_date_time',
                label: {
                    type: 'custom',
                    custom: "Arnold's Date & Time",
                },
                type: 'text',
                text: { default_value: combinedThaiDate },
            })
        }
        // if (combinedUtcDate) {
        //     customFields.push({
        //         key: 'utc_date_time',
        //         label: { type: 'custom', custom: 'UTC Date & Time' },
        //         type: 'text',
        //         text: { default_value: combinedUtcDate },
        //     })
        // }

        const metadata = {
            appointment_date_time: combinedCsrDate || '',
            th_date_time: combinedThaiDate || '',
            utc_date_time: combinedUtcDate || '',
            csrTimeZone: userTimeZone || '',
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
