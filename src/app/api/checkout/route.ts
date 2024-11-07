import { parseAbsoluteToLocal, fromDate } from '@internationalized/date'
import { generateSecureDownloadToken } from '@/utils/generateSecureDownloadToken'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { DateTime } from 'luxon'

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
                    couponCodeError,
                },
            }),
            {
                status: 400,
            }
        )
    }

    function formatDateTime(dateTimeString: string) {
        const match = dateTimeString.match(
            /(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}).*\[(.+)]/
        )
        if (match) {
            return `${match[1]} | ${match[2]} [${match[3]}]`
        } else {
            throw new Error('Invalid date-time format')
        }
    }

    // try {
    //     const { priceId, email, timeZone, date, timeSlot, couponCode } = body

    //     let csrDate = ''
    //     let thDate = ''
    //     let utcDate = ''
    //     const customFields = []

    //     // Process date-related logic only if a valid date is provided
    //     if (date && date.trim() !== '') {
    //         const zonedDateTime = parseAbsoluteToLocal(date)

    //         const thDateTime = fromDate(
    //             new Date(zonedDateTime.toAbsoluteString()),
    //             'Asia/Bangkok'
    //         )
    //         const utcDateTime = fromDate(
    //             new Date(zonedDateTime.toAbsoluteString()),
    //             'utc'
    //         )

    //         csrDate = zonedDateTime.toString()
    //         thDate = thDateTime.toString()
    //         utcDate = utcDateTime.toString()

    //         // formatted # Outputs: 2024-09-30 | 21:30:00 [America/Chicago]
    //         const formattedcsrDateTime = formatDateTime(csrDate)
    //         const formattedThDateTime = formatDateTime(thDate)

    //         customFields.push({
    //             key: 'appointment_date_time',
    //             label: { type: 'custom', custom: 'Appointment date & time' },
    //             type: 'text',
    //             text: { default_value: formattedcsrDateTime },
    //         })
    //         customFields.push({
    //             key: 'th_date_time',
    //             label: { type: 'custom', custom: "Arnold's date & time" },
    //             type: 'text',
    //             text: { default_value: formattedThDateTime },
    //         })
    //     } else {
    //         console.log('No date provided, skipping date processing.')
    //     }

    //     const metadata = {
    //         appointment_date_time: csrDate || '',
    //         th_date_time: thDate || '',
    //         utc_date_time: utcDate || '',
    //         csrTimeZone: timeZone || '',
    //     }

    //     let successUrl = `https://oneromeo.com/confirmation?success=true&session_id={CHECKOUT_SESSION_ID}&appointment_date_time=${csrDate}&th_date_time=${thDate}&utc_date_time=${utcDate}&csrTimeZone=${timeZone}&email=${email}`

    try {
        const { priceId, email, timeZone, date, timeSlot, couponCode } = body

        let csrDate = ''
        let thDate = ''
        let utcDate = ''
        const customFields = []

        // Process date-related logic only if a valid date is provided
        if (date && date.trim() !== '') {
            // Use Luxon to handle the date conversions
            // First, parse the incoming date string which includes timezone info
            const customerDateTime = DateTime.fromISO(date)

            if (!customerDateTime.isValid) {
                throw new Error('Invalid date format received')
            }

            // Convert to different timezones while preserving the exact moment in time
            const thDateTime = customerDateTime.setZone('Asia/Bangkok')
            const utcDateTime = customerDateTime.setZone('UTC')
            const csrDateTime = customerDateTime.setZone(timeZone)

            // Store the formatted dates
            csrDate = csrDateTime.toISO() || ''
            thDate = thDateTime.toISO() || ''
            utcDate = utcDateTime.toISO() || ''

            // Format for display (customize the format as needed)
            const formattedCsrDateTime = csrDateTime.toFormat(
                'yyyy-MM-dd | HH:mm:ss [ZZZZ]'
            )
            const formattedThDateTime = thDateTime.toFormat(
                'yyyy-MM-dd | HH:mm:ss [ZZZZ]'
            )

            console.log('Date Debug:', {
                receivedDate: date,
                customerTimeZone: timeZone,
                csrFormatted: formattedCsrDateTime,
                thFormatted: formattedThDateTime,
                csrISO: csrDate,
                thISO: thDate,
                utcISO: utcDate,
            })

            customFields.push({
                key: 'appointment_date_time',
                label: { type: 'custom', custom: 'Appointment date & time' },
                type: 'text',
                text: { default_value: formattedCsrDateTime },
            })
            customFields.push({
                key: 'th_date_time',
                label: { type: 'custom', custom: "Arnold's date & time" },
                type: 'text',
                text: { default_value: formattedThDateTime },
            })
        } else {
            console.log('No date provided, skipping date processing.')
        }

        const metadata = {
            appointment_date_time: csrDate,
            th_date_time: thDate,
            utc_date_time: utcDate,
            csrTimeZone: timeZone,
        }

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

        let promotionCodeId: string | null = null

        if (couponCode) {
            const promotionCodes = await stripeInstance.promotionCodes.list({
                active: true,
                code: couponCode,
            })
            promotionCodeId =
                promotionCodes.data.length > 0
                    ? promotionCodes.data[0].id
                    : null

            if (!promotionCodeId) {
                return new Response(
                    JSON.stringify({
                        errors: {
                            couponCodeError: ['Invalid coupon code'],
                        },
                    }),
                    { status: 400 }
                )
            }
        }

        const discounts =
            priceId === singleSessionPriceId && promotionCodeId
                ? [{ promotion_code: promotionCodeId }]
                : []

        // URL encode the dates for the success URL
        const encodedCsrDate = encodeURIComponent(csrDate)
        const encodedThDate = encodeURIComponent(thDate)
        const encodedUtcDate = encodeURIComponent(utcDate)
        const encodedTimeZone = encodeURIComponent(timeZone)
        const encodedEmail = encodeURIComponent(email)

        let successUrl = `https://oneromeo.com/confirmation?success=true&session_id={CHECKOUT_SESSION_ID}&appointment_date_time=${encodedCsrDate}&th_date_time=${encodedThDate}&utc_date_time=${encodedUtcDate}&csrTimeZone=${encodedTimeZone}&email=${encodedEmail}`

        if (priceId === ebookPriceId) {
            const token = await generateSecureDownloadToken(email)
            successUrl += `&token=${token}`
        }

        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            custom_fields: customFields,
            discounts: discounts,
            metadata,
            mode: 'payment',
            customer_email: email,
            customer_creation: 'always',
            success_url: successUrl,
            cancel_url: 'https://oneromeo.com/',
        })

        return NextResponse.json({ url: session.url })
    } catch (err: any) {
        console.error('Error creating checkout session:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
