'use client'
import TestimonialsComponent from '@/components/testimonialsComponent'
import { Select, SelectItem } from '@nextui-org/react'
import { useState } from 'react'

function TestimonialsPage() {
    const [productName, setProductName] = useState<string | undefined>(
        undefined
    )

    const products = [
        { key: 'book', label: 'eBook' },
        { key: 'talk', label: 'U Talk, I Listen' },
    ]
    return (
        <div className="testimonials-container flex flex-col gap-5">
            <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                What People Say
            </h1>
            {/* Add a dropdown or input to filter by productName */}
            <Select
                className="max-w-xs self-center"
                label="Select an item"
                onChange={(e) => setProductName(e.target.value)}
            >
                {products.map((product) => (
                    <SelectItem key={product.key}>{product.label}</SelectItem>
                ))}
            </Select>
            <TestimonialsComponent productName={productName} />
        </div>
    )
}

export default TestimonialsPage
