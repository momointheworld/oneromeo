// Example function to trigger download
const downloadFile = async (token: string) => {
    try {
        const response = await fetch('/api/generate-download-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error('Error generating download URL:', errorData)
            return
        }

        const { url } = await response.json()

        // Open the download URL in a new tab or initiate download
        window.open(url, '_blank')
    } catch (error) {
        console.error('Error fetching download URL:', error)
    }
}
