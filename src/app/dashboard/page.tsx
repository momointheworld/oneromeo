import { format } from 'date-fns'
import Link from 'next/link'
import { db } from '@/db'
import paths from '@/components/paths'
import RenderAppointments from '@/components/renderAppointments'

export const revalidate = 3 // re-render in every 3 seconds
export default async function Dashboard() {
    const posts = await db.post.findMany({ orderBy: { date: 'desc' } }) // Ordering posts by date in descending order
    const latestPosts = posts.slice(0, 5) // Get the latest 5 posts
    const renderPosts = latestPosts.map((post) => {
        const formattedDate = format(new Date(post.date), 'MMMM d, yyyy')
        return (
            <Link
                key={post.id}
                href={paths.showSinglePost(post.id)}
                className="flex justify-between items-center p-2 border rounded hover:bg-stone-50 no-underline"
            >
                <div className="text-zinc-500">
                    {formattedDate} | {post.title}
                </div>
                {/* <div>{post.categoryIDs}</div> */}
                <div>view</div>
            </Link>
        )
    })

    const quizzes = await db.quiz.findMany({ orderBy: { date: 'desc' } })
    const latestQuizzes = quizzes.slice(0, 5) // Get the latest 5 quizzes
    const renderQuizzes = latestQuizzes.map((quiz) => {
        const formattedDate = format(new Date(quiz.date), 'MMMM d, yyyy')
        return (
            <Link
                key={quiz.id}
                href={paths.showSingleQuiz(quiz.id)}
                className="flex justify-between items-center p-2 border rounded hover:bg-stone-50 no-underline"
            >
                <div className="text-zinc-500">
                    {formattedDate} | {quiz.quizName}
                </div>
                <div>view</div>
            </Link>
        )
    })

    const appointments = await db.appointment.findMany({
        orderBy: { createdAt: 'desc' },
    })
    const latestAppointments = appointments.slice(0, 5) // Get the latest 5 appointments

    return (
        <div className="flex flex-col">
            <div className="flex justify-end">
                <div className="flex items-end">
                    <Link
                        href={paths.upload()}
                        className="border p-2 mx-1 text-slate-100 rounded bg-orange-500 hover:bg-orange-600 no-underline"
                    >
                        Upload Files
                    </Link>
                </div>
            </div>
            <div className="flex justify-between items-center sm:flex-row mt-5 ">
                <h1 className="text-xl font-bold">Latest Posts</h1>
                <div className="flex sm:flex-row">
                    <Link
                        href={paths.createNewPost()}
                        className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
                    >
                        Create New Post
                    </Link>
                    <Link
                        href={paths.showAllPosts()}
                        className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
                    >
                        View All Posts
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-5">
                {renderPosts}
                {/* {DisplayPostsByCategory} */}
            </div>
            <div className="flex justify-between items-center mt-10">
                <h1 className="text-xl font-bold">Latest Quizzes</h1>
                <div className="flex sm:flex-row">
                    <Link
                        href={paths.createNewQuiz()}
                        className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
                    >
                        Create New Quiz
                    </Link>
                    <Link
                        href={paths.showAllQuizzes()}
                        className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
                    >
                        View All Quizzes
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-5">{renderQuizzes}</div>
            <div className="flex justify-between items-center mt-10">
                <h1 className="text-xl font-bold">Latest Appointments</h1>
                <div className="flex sm:flex-row">
                    <Link
                        href={paths.createNewAppointment()}
                        className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
                    >
                        Create New Appointment
                    </Link>
                    <Link
                        href={paths.showAllAppointments()}
                        className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
                    >
                        View All Appointments
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-5">
                {' '}
                <RenderAppointments
                    latestAppointments={latestAppointments}
                    startIndex={1}
                    showDeleteButton={false}
                />
            </div>
            <div className="flex flex-col">
                <div className="flex justify-between items-center sm:flex-row mt-5">
                    <h2 className="text-xl font-bold">Customer Reviews</h2>
                    <div className="flex sm:flex-row">
                        <Link
                            href={paths.showAllCustomers()}
                            className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
                        >
                            View All Customer Reviews
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
