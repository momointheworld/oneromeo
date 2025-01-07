import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

export async function POST(request: NextRequest) {
    const { token } = await request.json()

    if (!token || typeof token !== 'string') {
        return NextResponse.json({ error: 'Token is invalid' }, { status: 400 })
    }

    try {
        // Retrieve the download token from the database using the session_id and token
        const tokenRecord = await db.downloadToken.findUnique({
            where: {
                token: token as string,
            },
        })

        if (!tokenRecord || tokenRecord.expirationDate < new Date()) {
            return NextResponse.json(
                { error: 'Token is invalid or expired' },
                { status: 400 }
            )
        }

        // Generate the download URL
        const downloadUrl = `/api/download-file?token=${tokenRecord.token}`

        return NextResponse.json({ url: downloadUrl })
    } catch (err) {
        console.error('Error generating download URL:', err)
        return NextResponse.json(
            { error: 'Error generating download URL' },
            { status: 500 }
        )
    }
}

// the logic behind the download
// 1. stripe checkout - webhook generates and saves the token with the email
// and session id to the DownloadToken table (the generate-and-save-secure-token API)
// 2. the webhook returns the confirmation URL that includes the session ID
// 3. with the session Id, you can look up for the token in the DownloadToken table (the get-token-by-session API)
// 4. the get-token-by-session API will call the download File API to generate the download URL
// 5. the download URL is used on the confirmation page
//  session ID (confirmation page URL)- Token generated & saved (webhook) - Download URL(get-token-by-session) - Download File (download-file)
