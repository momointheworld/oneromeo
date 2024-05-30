'use client';
import React, { useState, FormEvent } from 'react';
import {Button, Input, Textarea} from "@nextui-org/react";
 
export default function ContactPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
 
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null) // Clear previous errors when a new request starts
 
    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const name = formData.get('name') as string;
      const message = formData.get('message') as string;

      console.log({ email, name, message }); // Debugging log

      const response = await fetch('/api/email', {
        method: 'POST',
        body: JSON.stringify({
          email,
          name,
          message,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
 
      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.')
      }
      // const data = await response.json() 
      // Display success message
      setSuccessMessage('Your message has been sent successfully!');
       // Optionally, reset the form
    } catch (error: any) {
      // Capture the error message to display to the user
      setError(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
 
  return (
    <div>
        <h2>Have Questions? Drop us a line!</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage ? <div style={{ color: 'green' }}>{successMessage}</div>
      : (<form onSubmit={onSubmit}>
        <Input type="email" name="email" label="Email" required />
        <Input type="text" name="name" label="Name" required />
        <Textarea name="message" label="Message" required />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </Button>
      </form>) 
      }
    </div>
  )
}
