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
    name: string | null // Update here to allow null
    stripeCustomerId: string
    createdAt: Date
    updatedAt: Date
    reviewLinks: ReviewLink[]
}

interface RenderCustomersProps {
    customers: Customer[]
    handleSendReviewLink: (
        customerId: string,
        reviewLinkId: string
    ) => Promise<void>
}
const RenderCustomers: React.FC<
    RenderCustomersProps & { startIndex: number }
> = ({ customers, startIndex, handleSendReviewLink }) => {
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
                    {customers.map((customer, index) => (
                        <tr key={customer.id} className="border-t">
                            <td className="px-4 py-2">{startIndex + index}</td>
                            {/* Continuous index */}
                            <td className="px-4 py-2">
                                {customer.name || 'Unknown Name'}
                            </td>
                            <td className="px-4 py-2">{customer.email}</td>
                            <td className="px-4 py-2">
                                {customer.updatedAt.toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2">
                                {customer.reviewLinks.map((link) => (
                                    <div key={link.id} className="mb-2">
                                        <p className="text-sm">
                                            {link.productName}
                                        </p>
                                    </div>
                                ))}
                            </td>
                            <td className="px-4 py-2">
                                {customer.reviewLinks.map((link) => (
                                    <div key={link.id} className="mb-2">
                                        <p className="text-xs text-gray-500">
                                            Status: {link.status}
                                        </p>
                                    </div>
                                ))}
                            </td>
                            <td className="px-4 py-2">
                                {customer.reviewLinks.map((link) => (
                                    <SendReviewButton
                                        key={link.id}
                                        customerId={customer.id}
                                        linkId={link.id}
                                    />
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RenderCustomers
