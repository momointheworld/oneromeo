'use client'
import { fetchCustomersWithReviewLinks } from '@/actions'
import PageBreadCrumbs from '@/components/common/breadcrumbs'
import paths from '@/components/paths'
import RenderCustomers from '@/components/renderCustomers'
import { useEffect, useState } from 'react'

interface ReviewLink {
    id: string
    email: string
    productId: string
    productName: string
    token: string
    expiryDate: Date
    status: string
    createdAt: Date
    updatedAt: Date
}

interface Customer {
    id: string
    name: string | null
    email: string
    stripeCustomerId: string
    reviewLinks: ReviewLink[]
    createdAt: Date
    updatedAt: Date
}
interface Breadcrumb {
    href: string
    text: string
}

export default function ShowAllCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const breadcrumbs: Breadcrumb[] = [
        { href: paths.dashboard(), text: 'Dashboard' },
        { href: paths.showAllCustomers(), text: 'Customers Reviews' },
    ]
    const customersPerPage = 20

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            try {
                const customers = await fetchCustomersWithReviewLinks()
                // Sort customers by createdAt in descending order
                const sortedCustomers = customers.sort(
                    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
                )
                setCustomers(sortedCustomers)
            } catch (err) {
                setError('Failed to fetch customers')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const paginatedCustomers = customers.slice(
        (currentPage - 1) * customersPerPage,
        currentPage * customersPerPage
    )

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const totalPages = Math.ceil(customers.length / customersPerPage)

    const startIndex = (currentPage - 1) * customersPerPage + 1

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <PageBreadCrumbs items={breadcrumbs} />
                    <RenderCustomers
                        customers={paginatedCustomers}
                        startIndex={startIndex}
                        setCustomers={setCustomers}
                    />
                </div>
            )}

            <div className="flex justify-center mt-5">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                >
                    Previous
                </button>
                <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
