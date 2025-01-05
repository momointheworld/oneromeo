// actions/downloadFile.ts
export const downloadFile = async (
    token: string
): Promise<{ error?: string; downloadUrl?: string }> => {
    try {
        const response = await fetch('/api/get-download-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ token }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.log('Error Data:', errorData)
            return { error: errorData.error || 'Error fetching download URL' }
        }

        const { url } = await response.json()
        return { downloadUrl: url }
    } catch (error) {
        console.error('Error retrieving download URL:', error)
        return {
            error: 'An error occurred while retrieving the download URL. Please try again.',
        }
    }
}
