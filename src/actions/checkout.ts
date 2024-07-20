const checkout = async (
    priceId: string,
    email: string,
    timeZone: string,
    date: string,
    timeSlot: string
): Promise<void> => {
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ priceId, email, timeZone, date, timeSlot }),
        })

        if (!response.ok) {
            throw new Error('Failed to create checkout session')
        }

        const { url } = await response.json()
        window.location.href = url // Redirect to Stripe checkout
    } catch (error) {
        console.error('Error during checkout:', error)
        alert('An error occurred during checkout. Please try again.')
    }
}

export default checkout
