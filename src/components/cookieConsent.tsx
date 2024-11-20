'use client'
import { useState, useEffect } from 'react'
import { useCookieConsent } from '@/hooks/useCookieConsent'

const CookieConsent = () => {
    const [showPopup, setShowPopup] = useState(true)
    const { cookieConsent, updateCookieConsent } = useCookieConsent()

    useEffect(() => {
        const savedConsent = localStorage.getItem('cookieConsent')
        if (savedConsent) {
            setShowPopup(false)
        }
    }, [])

    const handleAccept = () => {
        updateCookieConsent('accepted')
        setShowPopup(false)
    }

    const handleDecline = () => {
        updateCookieConsent('declined')
        setShowPopup(false)
    }

    if (!showPopup) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-700 text-white p-4 z-50">
            <div className="flex justify-between items-center gap-2">
                <p className="text-sm">
                    We use cookies to improve your experience. By clicking
                    &quot;Accept&quot;, you agree to our use of cookies.{' '}
                    <a href="/privacy-policy" className="underline text-white">
                        Learn more
                    </a>
                    .
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        className="bg-green-500 text-white px-3 py-1 rounded md:mr-2"
                        onClick={handleAccept}
                    >
                        Accept
                    </button>
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={handleDecline}
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CookieConsent
