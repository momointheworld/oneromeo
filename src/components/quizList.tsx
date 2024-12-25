import Link from 'next/link'
import { Card } from '@nextui-org/react'
import parse from 'html-react-parser'

interface Quiz {
    slug: string
    quizName: string
    quizIcon: string
}

interface QuizListProps {
    quizzes: Quiz[]
}

const QuizList: React.FC<QuizListProps> = ({ quizzes }) => {
    const bgColors = [
        'bg-primary-50',
        'bg-secondary-50',
        'bg-warning-50',
        'bg-danger-50',
        'bg-neutral-50',
        'bg-red-50',
        'bg-orange-50',
        'bg-lime-50',
        'bg-sky-50',
    ] // List of background colors

    const linksWithIcons = quizzes.map((quiz, index) => ({
        href: `/quiz/${quiz.slug}`,
        text: quiz.quizName,
        icon: quiz.quizIcon,
        bgColor: bgColors[index % bgColors.length], // Cycle through background colors
    }))

    return (
        <div className="flex flex-wrap gap-4 p-4 justify-center text-center">
            {linksWithIcons.map((linkObj, index) => (
                <Card
                    key={index}
                    className={`flex flex-col justify-evenly items-center p-4 shadow-lg hover:shadow-2xl transition-shadow duration-300 ${linkObj.bgColor}`}
                    isHoverable
                    isFooterBlurred
                >
                    {parse(linkObj.icon)}
                    <Link href={linkObj.href} className="no-underline">
                        <p className="text-primary text-wrap sm:max-w-full md:max-w-48">
                            {linkObj.text}
                        </p>
                    </Link>
                </Card>
            ))}
        </div>
    )
}

export default QuizList
