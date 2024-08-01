const createCustomerPortalSession = async (
    customerId: string
): Promise<{ error?: string; url?: string }> => {
    try {
        const response = await fetch(
            'http://localhost:3000/api/create-customer-portal-session',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customerId }),
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            console.log('Error Data:', errorData)
            return {
                error:
                    errorData.error ||
                    'An error occurred while creating the customer portal session. Please try again.',
            }
        }

        const { url } = await response.json()
        return { url } // Return the URL if the customer portal session is created successfully
    } catch (error) {
        console.error('Error during customer portal session creation:', error)
        return {
            error: 'An error occurred during customer portal session creation. Please try again.',
        }
    }
}

export default createCustomerPortalSession
