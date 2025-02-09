'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DisplayMessage from '@/components/common/message'
import { Button } from '@nextui-org/react'
import { Image } from '@nextui-org/react'

const ConfirmationPage: React.FC = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const success = searchParams.get('success') === 'true'
    const sessionId = searchParams.get('session_id')
    const encodedTimeSlot = searchParams.get('appointment_date_time')
    const encodedThDate = searchParams.get('th_date_time')
    const encodedUtcDate = searchParams.get('utc_date_time')
    const encodedTimeZone = searchParams.get('csrTimeZone')
    const encodedEmail = searchParams.get('email')

    // Decode the parameters
    const timeSlot = encodedTimeSlot ? decodeURIComponent(encodedTimeSlot) : ''
    const thDate = encodedThDate ? decodeURIComponent(encodedThDate) : ''
    const utcSlot = encodedUtcDate ? decodeURIComponent(encodedUtcDate) : ''
    const timeZone = encodedTimeZone ? decodeURIComponent(encodedTimeZone) : ''
    const email = encodedEmail ? decodeURIComponent(encodedEmail) : ''

    const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
    const [downloadText, setDownloadText] = useState<string>('Processing...')
    const [loading, setLoading] = useState(true)
    const [formMessage, setFormMessage] = useState<{
        message: string
        color:
            | 'default'
            | 'primary'
            | 'secondary'
            | 'success'
            | 'warning'
            | 'danger'
            | undefined
    }>({ message: '', color: 'warning' })

    useEffect(() => {
        const fetchDownloadUrl = async () => {
            let token
            const maxRetries = 5
            const delay = 2000 // 2 seconds
            let attempts = 0

            setFormMessage({
                message: 'Hang tight! Your eBook is being prepared.',
                color: 'warning',
            })
            setLoading(true)

            while (!token && attempts < maxRetries) {
                try {
                    const response = await fetch(
                        `/api/get-token-by-session?session_id=${sessionId}`
                    )
                    if (response.ok) {
                        const data = await response.json()
                        token = data.token
                    } else {
                        setFormMessage({
                            message:
                                'Just a moment, please! Your eBook is on its way.',
                            color: 'warning',
                        })
                    }
                } catch (err: any) {
                    console.log(err.message)
                }

                if (!token) {
                    attempts++
                    await new Promise((resolve) => setTimeout(resolve, delay))
                }
            }

            if (token) {
                try {
                    const downloadResponse = await fetch(
                        '/api/get-download-url',
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ token }),
                        }
                    )
                    if (!downloadResponse.ok) {
                        throw new Error('Failed to fetch download URL')
                    }

                    const downloadData = await downloadResponse.json()
                    setDownloadUrl(downloadData.url)
                    setFormMessage({
                        message:
                            ' Your eBook is ready! You can download it now.',
                        color: 'success',
                    })
                    setDownloadText('Download eBook')
                    setLoading(false)
                } catch (err: any) {
                    setFormMessage(err.message)
                } finally {
                    setLoading(false)
                }
            } else {
                setFormMessage({
                    message:
                        'Token not found after multiple attempts. Please refresh the page and try again.',
                    color: 'danger',
                })
                setLoading(false)
            }
        }

        const urlParams = new URLSearchParams(window.location.search)
        const sessionId = urlParams.get('session_id')

        if (sessionId && encodedTimeSlot === '' && encodedThDate === '') {
            fetchDownloadUrl()
        } else {
            setLoading(false)
        }
    }, [encodedThDate, encodedTimeSlot, sessionId])

    useEffect(() => {
        if (!success) {
            router.push('/') // Redirect to home page if success is not true
        }
    }, [success, router])

    if (!success) {
        return null // Render nothing while redirecting
    }

    const hasAppointment = timeSlot && utcSlot

    function formatDateTime(dateTimeString: string) {
        const date = new Date(dateTimeString)
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date-time format')
        }

        // Format the date and time
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'long', // "November"
            day: 'numeric', // "12"
            year: 'numeric', // "2024"
        })

        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Use 12-hour format (AM/PM)
        })

        // Return formatted date and time
        return `${formattedDate} | ${formattedTime}`
    }

    const formattedTimeSlot = timeSlot ? formatDateTime(timeSlot) : ''

    const handleDownload = async () => {
        if (downloadUrl) {
            const a = document.createElement('a')
            a.href = downloadUrl
            a.download = 'Not-in-a-Million-Years-by-Arnold-Meindertsma.epub'
            a.click()
            setFormMessage({
                message:
                    'Just a moment, your eBook is on its way and will be ready in a few seconds.',
                color: 'warning',
            })
        } else {
            setFormMessage({
                message: 'Download URL is not available.',
                color: 'danger',
            })
        }
    }

    return (
        <div className="text-center">
            <DisplayMessage
                formStateMessage={formMessage.message}
                color={formMessage.color}
            />
            {hasAppointment ? (
                <>
                    <div>
                        <h1>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-10 text-yellow-600 inline"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                />
                            </svg>{' '}
                            Thanks for that!
                        </h1>
                        We’ll send you a confirmation email soon 😊
                    </div>
                    <table className="mt-14 flex justify-center p-4 text-lg">
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Your email:</strong>
                                </td>
                                <td>{email}</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Your appointment is on:</strong>
                                </td>
                                <td>{formattedTimeSlot}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            ) : (
                <div className="p-2">
                    <h1>Thanks, it&apos;s much appreciated. Enjoy the read!</h1>
                    <Button
                        onPress={handleDownload}
                        variant="bordered"
                        color="primary"
                        isLoading={loading}
                    >
                        {downloadText}
                    </Button>
                    <p className="text-slate-400">
                        This download link is valid for 1 hour.
                    </p>
                    <div className="flex justify-center">
                        <Image
                            isBlurred
                            alt="confirmation-image"
                            src="/ebook-conf-img.png"
                            width={150}
                            className="aspect-w-4 aspect-h-3 transform scale-125 h-auto w-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default function ConfirmationPageWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmationPage />
        </Suspense>
    )
}
