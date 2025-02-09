'use client'

import DisplayMessage from '@/components/common/message'
import paths from '@/components/paths'
import { useRef, useState } from 'react'
import PageBreadCrumbs from '@/components/common/breadcrumbs'
import { Button } from '@nextui-org/react'

interface Breadcrumb {
    href: string
    text: string
}

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null)
    const [formMessage, setFormMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const breadcrumbs: Breadcrumb[] = [
        { href: paths.dashboard(), text: 'Dashboard' },
        { href: paths.upload(), text: 'Upload' },
    ]

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
            setLoading(true)
            const response = await fetch('/api/upload-file', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                console.log('File uploaded successfully')
                setFormMessage('File uploaded successfully')
                setFile(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = '' // Clear the file input
                }
            } else {
                console.error('Error uploading file')
                setFormMessage('Error uploading file')
            }
        } catch (error) {
            console.error('Error:', error)
            setFormMessage('Failed to upload, try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <PageBreadCrumbs items={breadcrumbs} />
            <div className="flex flex-col gap-y-5">
                <input
                    type="file"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
                <Button
                    onClick={handleUpload}
                    color="primary"
                    variant="bordered"
                >
                    Upload
                </Button>
                <DisplayMessage
                    formStateMessage={formMessage}
                    color="warning"
                />
            </div>
        </div>
    )
}

export default UploadPage
