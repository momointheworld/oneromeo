'use client'
import { DatePicker } from '@nextui-org/react'
import {
    today,
    isWeekend,
    getLocalTimeZone,
    DateValue,
} from '@internationalized/date'
import { useLocale } from '@react-aria/i18n'
import React, { useEffect, useState } from 'react'

const StripePricingTable = () => {
    const PRICING_TABLE_ID = process.env.PRICING_TABLE_ID
    const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/pricing-table.js'
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    }, [])

    return React.createElement('stripe-pricing-table', {
        'pricing-table-id': PRICING_TABLE_ID,
        'publishable-key': NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    })
}

const AppointmentForm = () => {
    let now = today(getLocalTimeZone())

    let startDate = now.add({ days: 1 }) // Tomorrow
    let endDate = now.add({ days: 30 }) // Two weeks from tomorrow

    let disabledRanges = [
        [now.add({ days: -365 }), now], // All dates before today
        [endDate.add({ days: 1 }), now.add({ days: 365 })], // All dates after two weeks from tomorrow
    ]

    let { locale } = useLocale()

    let isDateUnavailable = (date: DateValue) =>
        // isWeekend(date, locale) ||
        disabledRanges.some(
            (interval) =>
                date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
        )

    return (
        <DatePicker
            label="Appointment date"
            aria-label="Appointment date"
            isDateUnavailable={isDateUnavailable}
            minValue={startDate}
        />
    )
}

const OrderForm = () => {
    return (
        <>
            <AppointmentForm />
            <StripePricingTable />
        </>
    )
}

export default OrderForm
