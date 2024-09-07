'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { downloadFile } from '@/actions'
import DisplayMessage from '@/components/common/message'
import { Button, Textarea } from '@nextui-org/react'

interface DownloadResponse {
    error?: string
    downloadUrl?: string
}

const ConfirmationPage: React.FC = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const success = searchParams.get('success') === 'true'
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const timeSlot = searchParams.get('timeSlot')
    const dateParam = searchParams.get('date')
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [formMessage, setFormMessage] = useState('')

    // Convert the date string to a Date object
    const date = dateParam ? new Date(dateParam) : null

    // Format the date as "Month Day, Year"
    const formattedDate = date
        ? date.toLocaleDateString('en-US', {
              month: 'long', // "September"
              day: 'numeric', // "10"
              year: 'numeric', // "2024"
          })
        : ''

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

    // Process timeSlot
    const decodedTimeSlot = timeSlot ? decodeURIComponent(timeSlot) : ''
    // Split the timeSlot into two parts using the '(' character
    const [firstTimeSlot, lastTimeSlot] = decodedTimeSlot.split('(')
    // Extract and trim the first part of the time slot
    const displayTimeSlot = firstTimeSlot ? firstTimeSlot.trim() : ''
    const hasAppointment = firstTimeSlot && lastTimeSlot && date

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
                        <h1>Thanks for that!</h1>
                        <br />
                        We’ll send you a confirmation email soon 😊
                    </div>
                    <table className="mt-14 flex justify-center">
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
                                <td>{formattedDate}</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Time:</strong>
                                </td>
                                <td>{displayTimeSlot}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            ) : (
                <div>
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
