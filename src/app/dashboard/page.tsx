import { format } from 'date-fns'
import Link from 'next/link'
import { db } from '@/db'
import paths from '@/components/paths'
import RenderAppointments from '@/components/renderAppointments'
import { fetchCustomersWithReviewLinks } from '@/actions/fetchCustomersWithReviewLinks'
import RenderCustomers, { Customer } from '@/components/renderCustomers'
import { updateReviewLinkStatus } from '@/actions/updateReviewLinkStatus'
import { getReviewLinkByEmail } from '@/actions'

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
    const customers = await fetchCustomersWithReviewLinks()
    const latestCustomers = customers.slice(-5) // Get the last 5 customers
    const sortedCustomers = latestCustomers.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime() // Sort in descending order (newer first)
    )
    const startIndex = 1

    // server component, cannot use the RenderCustomer component here, thus we need to re-implement the same logic
    const renderCustomers = sortedCustomers.map((customer, index) => {
        const reviewLink = customer.reviewLinks[0] // Pick the first review link for each customer

        return (
            <div className="overflow-x-auto" key={customer.id}>
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">#</th>
                            <th className="px-4 py-2 text-left">
                                Customer Name
                            </th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Updated At</th>
                            <th className="px-4 py-2 text-left">Product</th>
                            <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-t">
                            <td className="px-4">{startIndex + index}</td>
                            {/* Continuous index */}
                            <td className="px-4">
                                {customer.name || 'Unknown Name'}
                            </td>
                            <td className="px-4">{customer.email}</td>
                            <td className="px-4">
                                {customer.updatedAt.toLocaleDateString()}
                            </td>
                            <td className="px-4">
                                {customer.reviewLinks.map((link) => (
                                    <div key={link.id} className="mb-2">
                                        <p className="text-sm">
                                            {link.productName}
                                        </p>
                                    </div>
                                ))}
                            </td>
                            <td
                                className={`px-4 text-2xl ${
                                    reviewLink
                                        ? reviewLink.status === 'sent'
                                            ? 'bg-green-100 text-green-800'
                                            : reviewLink.status === 'failed'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                        : 'bg-gray-50 text-gray-800'
                                }`}
                            >
                                {reviewLink ? (
                                    <p className="text-xs">
                                        Status: {reviewLink.status}
                                    </p>
                                ) : (
                                    'No review link'
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    })

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
                    <p className="text-xl font-bold">Customer Reviews</p>
                    <div className="flex sm:flex-row">
                        <Link
                            href={paths.showAllCustomers()}
                            className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
                        >
                            View All Customer Reviews
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-5">
                    {renderCustomers}
                </div>
            </div>
        </div>
    )
}
