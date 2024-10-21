import Link from 'next/link'
import { Card } from '@nextui-org/react'

interface Quiz {
    slug: string
    quizName: string
}

interface QuizListProps {
    quizzes: Quiz[]
    icons: React.ReactNode[]
}

const QuizList: React.FC<QuizListProps> = ({ quizzes, icons }) => {
    const linksWithIcons = quizzes.map((quiz, index) => ({
        href: `/quiz/${quiz.slug}`,
        text: quiz.quizName,
        icon: icons[index % icons.length], // Cycle through icons
    }))

    return (
        <div className="flex flex-wrap gap-4 p-4">
            {linksWithIcons.map((linkObj, index) => (
                <Card
                    key={index}
                    className="flex flex-col justify-between items-center p-4 shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    isHoverable
                    isFooterBlurred
                >
                    {linkObj.icon}
                    <Link href={linkObj.href} className="no-underline">
                        <h4 className="text-primary">{linkObj.text}</h4>
                    </Link>
                </Card>
            ))}
        </div>
    )
}

export default QuizList
