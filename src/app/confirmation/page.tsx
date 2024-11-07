'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { downloadFile } from '@/actions'
import DisplayMessage from '@/components/common/message'
import { Button } from '@nextui-org/react'
import { Image } from '@nextui-org/react'

interface DownloadResponse {
    error?: string
    downloadUrl?: string
}

// const ConfirmationPage: React.FC = () => {
//     const searchParams = useSearchParams()
//     const router = useRouter()
//     const success = searchParams.get('success') === 'true'
//     const token = searchParams.get('token')
//     const email = searchParams.get('email')
//     const timeSlot = searchParams.get('appointment_date_time')
//     const utcSlot = searchParams.get('utc_date_time')
//     const dateParam = searchParams.get('createdAt')
//     const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
//     const [loading, setLoading] = useState(true)
//     const [formMessage, setFormMessage] = useState('')

//     // Convert the date string to a Date object
//     const date = dateParam ? new Date(dateParam) : null

//     // Format the date as "Month Day, Year"
//     const formattedDate = date
//         ? date.toLocaleDateString('en-US', {
//               month: 'long', // "September"
//               day: 'numeric', // "10"
//               year: 'numeric', // "2024"
//           })
//         : ''

const ConfirmationPage: React.FC = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    // Get query params from the URL
    const success = searchParams.get('success') === 'true'
    const sessionId = searchParams.get('session_id')
    const token = searchParams.get('token')
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
    const [loading, setLoading] = useState(true)
    const [formMessage, setFormMessage] = useState('')

    useEffect(() => {
        const fetchDownloadUrl = async () => {
            if (token) {
                const { error, downloadUrl }: DownloadResponse =
                    await downloadFile(token)
                if (error) {
                    setFormMessage(error)
                } else {
                    setDownloadUrl(downloadUrl || null)
                }
            }
            setLoading(false)
        }

        fetchDownloadUrl()
    }, [token])

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
            setFormMessage(
                'Just a moment, your eBook is on its way and will be ready in a few seconds.'
            )
        } else {
            setFormMessage('Download URL is not available.')
        }
    }

    return (
        <div className="text-center">
            <DisplayMessage formStateMessage={formMessage} />
            {hasAppointment ? (
                <>
                    <div>
                        <h1>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-10 text-yellow-600 inline"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
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
                        onClick={handleDownload}
                        variant="bordered"
                        color="primary"
                    >
                        Download eBook
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
