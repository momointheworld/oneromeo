const checkout = async (
    priceId: string,
    email: string,
    timeZone: string,
    date: string,
    timeSlot: string,
    couponCode: string
): Promise<{ error?: string; url?: string }> => {
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId,
                email,
                timeZone,
                date,
                timeSlot,
                couponCode, // Use couponCode here
            }),
        })
        if (!response.ok) {
            const errorData = await response.json()
            console.log('Error Data:', errorData)

            // Extract specific error types from the response
            const {
                emailError,
                timezoneError,
                dateError,
                timeSlotError,
                couponCodeError,
            } = errorData.errors || {}

            // Create formatted errors as a single string
            const formattedErrors = [
                ...(emailError || []).map(
                    (error: any) => `Email Error: ${error}`
                ),
                ...(timezoneError || []).map(
                    (error: any) => `Timezone Error: ${error}`
                ),
                ...(dateError || []).map(
                    (error: any) => `Date Error: ${error}`
                ),
                ...(timeSlotError || []).map(
                    (error: any) => `Time Slot Error: ${error}`
                ),
                ...(couponCodeError || []).map(
                    (error: any) => `Coupon Code Error: ${error}`
                ),
            ].join(' | ')

            console.log('Formatted Errors:', formattedErrors)
            // error can only be string, so formattedErros is combined as one string
            return { error: formattedErrors }
        }

        const { url } = await response.json()
        return { url } // Return the URL if the checkout session is created successfully
    } catch (error) {
        console.error('Error during checkout:', error)
        return { error: 'An error occurred during checkout. Please try again.' }
    }
}

export default checkout
