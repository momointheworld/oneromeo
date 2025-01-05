// import { NextRequest, NextResponse } from 'next/server'
// import { db } from '@/db'

// export async function POST(request: NextRequest) {
//     const { token } = await request.json()

//     if (!token || typeof token !== 'string') {
//         return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
//     }

//     try {
//         // Validate the token
//         const tokenRecord = await db.downloadToken.findUnique({
//             where: { token: token },
//         })

//         if (!tokenRecord || tokenRecord.expirationDate < new Date()) {
//             return NextResponse.json(
//                 { error: 'Token is invalid or expired' },
//                 { status: 400 }
//             )
//         }

//         // Generate the download URL
//         const downloadUrl = `/api/download-file?token=${encodeURIComponent(
//             token
//         )}`

//         return NextResponse.json({ url: downloadUrl })
//     } catch (err) {
//         console.error('Error generating download URL:', err)
//         return NextResponse.json(
//             { error: 'Error generating download URL' },
//             { status: 500 }
//         )
//     }
// }

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

export async function POST(request: NextRequest) {
    const authorizationHeader = request.headers.get('Authorization')

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return NextResponse.json(
            { error: 'Invalid or missing Authorization header' },
            { status: 400 }
        )
    }

    const token = authorizationHeader.split(' ')[1] // Extract token from 'Bearer <token>'

    if (!token || typeof token !== 'string') {
        return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    try {
        // Validate the token
        const tokenRecord = await db.downloadToken.findUnique({
            where: { token: token },
        })

        console.log('Token record found:', tokenRecord)

        if (!tokenRecord) {
            return NextResponse.json(
                { error: 'Token not found' },
                { status: 400 }
            )
        }

        // Check if the token has expired
        const currentDate = new Date()
        console.log('Current date/time:', currentDate)
        console.log('Token expiration date:', tokenRecord.expirationDate)

        if (tokenRecord.expirationDate < currentDate) {
            return NextResponse.json(
                { error: 'Token is expired' },
                { status: 400 }
            )
        }

        // Generate the download URL
        const downloadUrl = `/api/download-file?token=${encodeURIComponent(
            token
        )}`

        return NextResponse.json({ url: downloadUrl })
    } catch (err) {
        console.error('Error generating download URL:', err)
        return NextResponse.json(
            { error: 'Error generating download URL' },
            { status: 500 }
        )
    }
}
