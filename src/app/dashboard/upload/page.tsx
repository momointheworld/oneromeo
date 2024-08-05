'use client'

import { useState } from 'react'

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('/api/upload-file', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                console.log('File uploaded successfully')
            } else {
                console.error('Error uploading file')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    )
}

export default UploadPage
