import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, GridFSBucket } from 'mongodb'
import { Readable } from 'stream'
import { db } from '@/db'

const MONGODB_URI = process.env.DATABASE_URL as string

// Convert Node.js Readable stream to Web ReadableStream
const nodeToWebReadableStream = (
    nodeStream: Readable
): ReadableStream<Uint8Array> => {
    return new ReadableStream<Uint8Array>({
        start(controller) {
            nodeStream.on('data', (chunk) => {
                console.log('Streaming data chunk of size:', chunk.length)
                controller.enqueue(new Uint8Array(chunk))
            })

            nodeStream.on('end', () => {
                console.log('Streaming ended')
                controller.close()
            })

            nodeStream.on('error', (err) => {
                console.error('Stream error:', err)
                controller.error(err)
            })
        },
    })
}

let client: MongoClient | null = null

const getClient = async () => {
    if (client) {
        return client
    }

    client = new MongoClient(MONGODB_URI)

    await client.connect()
    return client
}

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
        console.error('Token is required but not provided')
        return NextResponse.json(
            { error: 'Token is required' },
            { status: 400 }
        )
    }

    try {
        console.log('Validating token:', token)
        // Validate the token
        const tokenRecord = await db.downloadToken.findUnique({
            where: { token: token },
        })

        if (!tokenRecord || tokenRecord.expirationDate < new Date()) {
            console.error('Token is invalid or expired:', tokenRecord)
            return NextResponse.json(
                { error: 'Token is invalid or expired' },
                { status: 400 }
            )
        }

        console.log('Token validated successfully, connecting to MongoDB')
        const client = await getClient()
        const dbMongo = client.db()
        const bucket = new GridFSBucket(dbMongo, { bucketName: 'fileBucket' })

        const fileName = 'Not-in-a-Million-Years-by-Arnold-Meindertsma.epub' // Adjust the filename as needed
        console.log('Opening download stream for file:', fileName)
        const downloadStream = bucket.openDownloadStreamByName(fileName)

        // Convert Node.js stream to Web ReadableStream
        const webReadableStream = nodeToWebReadableStream(downloadStream)

        const headers = new Headers({
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': 'application/epub+zip', // Adjust if needed
        })

        console.log('Download token set in cookie:', token)

        console.log('Returning response with file stream')
        // Return the response without closing the client
        return new NextResponse(webReadableStream, { headers })
    } catch (err) {
        console.error('Error processing request:', err)
        return NextResponse.json(
            { error: 'Error processing request' },
            { status: 500 }
        )
    }
}
