'use client'
import React, { useState, FormEvent } from 'react'
import { Button, Form, Input, Textarea } from '@nextui-org/react'

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    // const [errors, setErrors] = useState<{ [key: string]: string | null }>({})
    const [errors, setErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        try {
            const formData = Object.fromEntries(
                new FormData(event.currentTarget)
            )

            // const formData = new FormData(event.currentTarget)
            const email = formData.email as string
            const name = formData.name as string
            const description = formData.description as string

            const response = await fetch('/api/email', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    name,
                    description,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json()

            if (!response.ok) {
                if (data.errors) {
                    // const newErrors: { [key: string]: string } = {}
                    // for (const key in data.errors) {
                    //     if (data.errors[key]) {
                    //         newErrors[key] = data.errors[key].join(', ')
                    //     }
                    // }
                    setErrors(data.errors)
                } else {
                    setErrors({
                        general:
                            data.error ||
                            'Failed to send the email. Please try again.',
                    })
                }
                return
            }

            setSuccessMessage(
                "Thank you for reaching out. I'll be in touch soon."
            )
        } catch (error: any) {
            setErrors({
                general:
                    error.code === 'ECONNECTION'
                        ? 'Failed to send the email: Connection error. Please try again later.'
                        : error.message || 'An unexpected error occurred.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="text-center">
            {successMessage ? (
                <div className="flex flex-col items-center gap-5">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-20 text-green-600"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                        />
                    </svg>

                    <div style={{ color: 'green' }}>{successMessage}</div>
                </div>
            ) : (
                <div>
                    <h1>{`Say hello :)`} </h1>
                    {/* contact-bg class added for styling the background in global.css */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 px-5 contact-bg">
                        {/* Display general error message */}

                        <Form
                            onSubmit={onSubmit}
                            className="flex flex-col gap-4 col-span-1 sm:col-start-2 sm:col-span-3 w-full"
                            validationBehavior="native"
                            validationErrors={errors}
                        >
                            <Input
                                type="email"
                                name="email"
                                label="Email"
                                required
                            />
                            <Input
                                type="text"
                                name="name"
                                label="Name"
                                required
                            />
                            <div className="base/inputWrapper w-full">
                                <Textarea
                                    name="description"
                                    label="What's on your mind?"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                color="primary"
                                isLoading={isLoading}
                                className="w-full"
                            >
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </Form>
                    </div>
                    <h2 className="mt-10">
                        And/or join the conversation on{' '}
                        <a
                            href="https://discord.gg/FTMDwjSj"
                            target="_blank"
                            className="text-warning"
                        >
                            Discord
                        </a>{' '}
                    </h2>
                </div>
            )}
        </div>
    )
}
