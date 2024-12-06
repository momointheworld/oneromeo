import { NextApiResponse } from 'next'
import { NextResponse, NextRequest } from 'next/server'

type NextApiHandler = (req: NextRequest, res: NextApiResponse) => Promise<void>

const actionHeaderCheckOverride = async (
    req: NextRequest,
    res: NextApiResponse,
    next: NextApiHandler
): Promise<any> => {
    console.debug('REQUEST HEADERS:::: ', req.headers)

    const response = NextResponse.next()
    response.headers.set(
        'x-forwarded-host',
        req.headers.get('origin')?.replace(/(http|https):\/\//, '') || '*'
    )
    return response
}

export default actionHeaderCheckOverride
