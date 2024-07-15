'use client'
import React, { useEffect } from 'react'

const StripePricingTable = () => {
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
        'pricing-table-id': 'prctbl_1PaEAuHcOAKxyg1ZMHBn8Ca8',
        'publishable-key': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    })
}

export default StripePricingTable
