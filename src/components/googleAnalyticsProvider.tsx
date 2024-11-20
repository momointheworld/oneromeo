'use client'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import { useCookieConsent } from '@/hooks/useCookieConsent'

export function GoogleAnalyticsProvider() {
    const { cookieConsent } = useCookieConsent()

    if (cookieConsent !== 'accepted') return null

    return <GoogleAnalytics trackPageViews gaMeasurementId="G-337279624" />
}
