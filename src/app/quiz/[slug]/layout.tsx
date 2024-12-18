// dynamically generate the metadata for Quiz Page
import { generateQuizMetadata } from '@/utils/generateQuizMetadata'

export const generateMetadata = async ({
    params,
}: {
    params: { slug: string }
}) => {
    const metadata = await generateQuizMetadata({ params })
    return {
        title: metadata.title,
        description: metadata.description,
    }
}

export default function SingleQuizLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div>{children}</div>
}
