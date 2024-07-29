'use client'
import React, { useState, FormEvent } from 'react'
import { Button, Input, Textarea } from '@nextui-org/react'

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({})
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(event.currentTarget)
            const email = formData.get('email') as string
            const name = formData.get('name') as string
            const description = formData.get('description') as string

            console.log({ email, name, description }) // Debugging log

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
            if (!response.ok) {
                const data = await response.json()
                if (data.errors) {
                    const newErrors: { [key: string]: string } = {}
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            newErrors[key] = data.errors[key].join(', ')
                        }
                    }
                    setErrors(newErrors)
                    return
                }
                throw new Error('Failed to send the email. Please try again.')
            }
            // Display success message
            setSuccessMessage(
                'Thank you for reaching out. We will get back to you soon.'
            )
        } catch (error: any) {
            console.error(error)
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

                    <div className="grid grid-cols-1 sm:grid-cols-6">
                        <form
                            onSubmit={onSubmit}
                            className="flex flex-col gap-4 col-span-1 sm:col-start-2 sm:col-span-4 w-full"
                        >
                            <Input
                                type="email"
                                name="email"
                                label="Email"
                                isInvalid={!!errors.email}
                                errorMessage={errors.email}
                                required
                            />
                            <Input
                                type="text"
                                name="name"
                                label="Name"
                                isInvalid={!!errors.name}
                                errorMessage={errors.name}
                                required
                            />
                            <Textarea
                                name="description"
                                label="Description"
                                isInvalid={!!errors.description}
                                errorMessage={errors.description}
                                required
                            />
                            <Button
                                type="submit"
                                disabled={isLoading}
                                color="primary"
                            >
                                {isLoading ? 'Loading...' : 'Submit'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
