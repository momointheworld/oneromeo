import { getQuizBySlug } from '@/actions/getQuiz'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ParsedUrlQuery } from 'querystring'

interface Params extends ParsedUrlQuery {
    slug: string
}

export async function generateQuizMetadata({
    params,
}: {
    params: Params
}): Promise<Metadata> {
    const { slug } = params
    const quizData = await getQuizBySlug({ slug })

    if (quizData === notFound) {
        return {
            title: 'OneRomeo Quiz',
            description: 'Sorry, the quiz you are looking for does not exist.',
        }
    }
    if (typeof quizData === 'function') {
        throw new Error('Unexpected type: quizData is a function')
    }

    const metadata = {
        title: quizData.quizName || 'OneRomeo Quiz',
        description: quizData.quizDescription || 'Default Quiz Description',
    }
    return metadata
}
