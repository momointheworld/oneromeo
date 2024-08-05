// import type { NextRequest } from 'next/server'
// import { NextResponse } from 'next/server'
// import { MongoClient, GridFSBucket } from 'mongodb'
// import fs from 'fs'
// import path from 'path'
// import { db } from '@/db'

// const MONGODB_URI = process.env.DATABASE_URL as string

// export const runtime = 'nodejs'
// export const preferredRegion = 'auto'

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// }

// export const POST = async (req: NextRequest) => {
//     const client = new MongoClient(MONGODB_URI)

//     try {
//         console.log('Connecting to MongoDB...')
//         await client.connect()
//         const dbMongo = client.db()
//         const bucket = new GridFSBucket(dbMongo)

//         console.log('Parsing form data...')
//         const formData = await req.formData()
//         const file = formData.get('file') as File

//         if (!file) {
//             console.log('No file uploaded')
//             return NextResponse.json(
//                 { error: 'No file uploaded' },
//                 { status: 400 }
//             )
//         }

//         const tempDir = path.join(process.cwd(), 'tmp')
//         await fs.promises.mkdir(tempDir, { recursive: true }) // Ensure temp directory exists

//         const filePath = path.join(tempDir, file.name)
//         const fileBuffer = Buffer.from(await file.arrayBuffer())

//         console.log('Writing file to temp directory...')
//         await fs.promises.writeFile(filePath, fileBuffer)

//         console.log('Creating upload stream...')
//         const uploadStream = bucket.openUploadStream(file.name)

//         console.log('Piping file to upload stream...')
//         fs.createReadStream(filePath).pipe(uploadStream)

//         return new Promise<NextResponse>((resolve, reject) => {
//             uploadStream.on('finish', async () => {
//                 try {
//                     console.log('File upload complete, cleaning up...')
//                     await fs.promises.unlink(filePath) // Clean up temp file

//                     console.log('Saving file metadata to database...')
//                     await db.ebook.create({
//                         data: {
//                             name: file.name,
//                             fileType: file.type,
//                             uploadDate: new Date(),
//                             fileSize: file.size,
//                         },
//                     })
//                     console.log('File metadata saved to database')

//                     resolve(
//                         NextResponse.json(
//                             { message: 'File uploaded successfully.' },
//                             { status: 200 }
//                         )
//                     )
//                 } catch (error: any) {
//                     console.error('Error during file processing:', error)
//                     reject(
//                         NextResponse.json(
//                             {
//                                 error: 'Error processing file',
//                                 details: error.message,
//                             },
//                             { status: 500 }
//                         )
//                     )
//                 }
//             })

//             uploadStream.on('error', (err) => {
//                 console.error('Upload stream error:', err)
//                 resolve(
//                     NextResponse.json(
//                         {
//                             error: 'Error uploading file',
//                             details: err.message,
//                         },
//                         { status: 500 }
//                     )
//                 )
//             })
//         })
//     } catch (err: any) {
//         console.error('Error connecting to database:', err)
//         return NextResponse.json(
//             {
//                 error: 'Error connecting to database',
//                 details: err.message,
//             },
//             { status: 500 }
//         )
//     } finally {
//         console.log('Closing MongoDB connection...')
//         await client.close()
//     }
// }
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { MongoClient, GridFSBucket } from 'mongodb'
import fs from 'fs'
import path from 'path'
import { db } from '@/db'

const MONGODB_URI = process.env.DATABASE_URL as string

export const runtime = 'nodejs'
export const preferredRegion = 'auto'

export const config = {
    api: {
        bodyParser: false,
    },
}
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
            Buffer.from(await file.arrayBuffer())
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
