import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    // Define your expected host (domain)
    const allowedHost = 'oneromeo.com'

    // Get `x-forwarded-host` and `origin` headers
    const forwardedHost = req.headers.get('x-forwarded-host') || ''
    const originHost =
        req.headers
            .get('origin')
            ?.replace(/(http|https):\/\//, '')
            .replace(/\/$/, '') || '' // Normalize origin host

    // Validate the headers
    if (
        forwardedHost.includes(allowedHost) ||
        originHost.includes(allowedHost)
    ) {
        // Headers are valid, proceed with the request
        const response = NextResponse.next()
        return response
    }

    // Invalid headers, reject the request
    return new NextResponse(
        'Header mismatch: Invalid forwarded host or origin',
        {
            status: 400,
        }
    )
}
