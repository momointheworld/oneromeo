import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { MongoClient, GridFSBucket } from 'mongodb'
import fs from 'fs'
import path from 'path'
import { db } from '@/db'

const MONGODB_URI = process.env.DATABASE_URL as string

export const runtime = 'nodejs'
export const preferredRegion = 'auto'

export const dynamic = 'auto'
export const revalidate = false
export const fetchCache = 'auto'
export const dynamicParams = true

export const POST = async (req: NextRequest) => {
    const client = new MongoClient(MONGODB_URI)
    const bucket = new GridFSBucket(client.db(), { bucketName: 'fileBucket' })

    try {
        console.log('Connecting to MongoDB...')
        await client.connect()
        console.log('Connected to MongoDB')

        console.log('Parsing form data...')
        const formData = await req.formData()
        console.log('Form data parsed')

        const fileEntry = formData.get('file')
        if (!fileEntry || typeof fileEntry === 'string') {
            console.log('No valid file uploaded or file is not a File object')
            return NextResponse.json(
                { error: 'No valid file uploaded' },
                { status: 400 }
            )
        }

        const file = fileEntry as File // Ensure correct type casting
        console.log('File received:', file.name)

        // Ensure the tmp directory exists
        const tmpDir = path.join(process.cwd(), 'tmp')
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir)
            console.log('Temporary directory created:', tmpDir)
        }

        const filePath = path.join(tmpDir, file.name)
        console.log('Writing file to temp directory...')
        await fs.promises.writeFile(
            filePath,
            new Uint8Array(await file.arrayBuffer())
        )
        console.log('File written to temp directory')

        const uploadStream = bucket.openUploadStream(file.name)
        console.log('Creating upload stream...')
        const readStream = fs.createReadStream(filePath)
        readStream.pipe(uploadStream)
        console.log('Piping file to upload stream')

        return new Promise<NextResponse>((resolve, reject) => {
            uploadStream.on('finish', async () => {
                try {
                    console.log('File upload complete, cleaning up...')
                    await fs.promises.unlink(filePath) // Clean up temp file

                    console.log('Saving file metadata to database...')
                    await db.ebook.create({
                        data: {
                            name: file.name,
                            fileType: file.type,
                            uploadDate: new Date(),
                            fileSize: file.size,
                        },
                    })

                    console.log('File metadata saved to database')

                    console.log('Closing MongoDB connection...')
                    await client.close()
                    console.log('MongoDB connection closed')

                    resolve(
                        NextResponse.json(
                            { message: 'File uploaded successfully.' },
                            { status: 200 }
                        )
                    )
                } catch (error: any) {
                    console.error('Error during file processing:', error)
                    reject(
                        NextResponse.json(
                            {
                                error: 'Error processing file',
                                details: error.message,
                            },
                            { status: 500 }
                        )
                    )
                }
            })

            uploadStream.on('error', (error) => {
                console.error('Error during file upload:', error)
                reject(
                    NextResponse.json(
                        { error: 'Error during file upload' },
                        { status: 500 }
                    )
                )
            })
        })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
