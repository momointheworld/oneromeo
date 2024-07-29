const checkout = async (
    priceId: string,
    email: string,
    timeZone: string,
    date: string,
    timeSlot: string
): Promise<{ error?: string; url?: string }> => {
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ priceId, email, timeZone, date, timeSlot }),
        })
        if (!response.ok) {
            const errorData = await response.json()
            console.log('Error Data:', errorData)

            // Extract specific error types from the response
            const { emailError, timezoneError, dateError, timeSlotError } =
                errorData.errors || {}

            // Create formatted messages
            const formattedErrors = [
                ...(timezoneError || []).map((error: any) => `${error}`),
                ...(dateError || []).map((error: any) => `${error}`),
                ...(timeSlotError || []).map((error: any) => `${error}`),
                ...(emailError || []).map((error: any) => `${error}`),
            ].join(' ')

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
