import React from 'react'
import SendReviewButton from './sendReviewButton'

export interface ReviewLink {
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

export interface Customer {
    id: string
    email: string
    name: string | null
    stripeCustomerId: string
    createdAt: Date
    updatedAt: Date
    reviewLinks: ReviewLink[]
}

interface RenderCustomersProps {
    customers: Customer[]
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
}

const RenderCustomers: React.FC<
    RenderCustomersProps & { startIndex: number }
> = ({ customers, startIndex, setCustomers }) => {
    const updateReviewLinkStatus = (reviewLinkId: string, status: string) => {
        setCustomers((prevCustomers) =>
            prevCustomers.map((customer) => ({
                ...customer,
                reviewLinks: customer.reviewLinks.map((reviewLink) =>
                    reviewLink.id === reviewLinkId
                        ? { ...reviewLink, status }
                        : reviewLink
                ),
            }))
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">Customer Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Updated At</th>
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer, index) => {
                        // Pick the first review link for each customer
                        const reviewLink = customer.reviewLinks[0]

                        return (
                            <tr key={customer.id} className="border-t">
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
                                    {/* List all products for the customer */}
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
                                    {/* Show status for the first review link */}
                                    {reviewLink ? (
                                        <p className="text-xs">
                                            Status: {reviewLink.status}
                                        </p>
                                    ) : (
                                        'No review link'
                                    )}
                                </td>

                                <td className="px-4">
                                    {/* Only show the Send Review Link button for the first review link */}
                                    {reviewLink && (
                                        <SendReviewButton
                                            email={customer.email}
                                            linkId={reviewLink.id}
                                            productName={reviewLink.productName}
                                            onSuccess={() =>
                                                updateReviewLinkStatus(
                                                    reviewLink.id,
                                                    'sent'
                                                )
                                            }
                                            onFail={() =>
                                                updateReviewLinkStatus(
                                                    reviewLink.id,
                                                    'failed'
                                                )
                                            }
                                        />
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default RenderCustomers
