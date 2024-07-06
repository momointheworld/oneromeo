'use server'

export default function PreviewPage() {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
        console.log('Order placed! You will receive an email confirmation.')
    }

    if (query.get('canceled')) {
        console.log(
            'Order canceled -- continue to shop around and checkout when you’re ready.'
        )
    }
}
