import React from 'react'
import SendReviewButton from './sendReviewButton'
import { GitHubEmail } from 'next-auth/providers/github'

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
}

const RenderCustomers: React.FC<
    RenderCustomersProps & { startIndex: number }
> = ({ customers, startIndex }) => {
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
                                <td className="px-4">
                                    {/* Show status for the first review link */}
                                    {reviewLink ? (
                                        <p className="text-xs text-gray-500">
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
