import React, { MouseEventHandler, useEffect, useState } from 'react'
import { Button, Chip } from '@nextui-org/react'
import Image, { StaticImageData } from 'next/image'
import { useSelectedItem } from '@/hooks/useSelectedItem'

interface Item {
    imgSrc: StaticImageData
    imgAlt: string
    title: string
    price: string
    priceId: string
    description: string
}

interface OrderItemsProps {
    handleItemClick: MouseEventHandler<HTMLButtonElement>
    items: Item[]
}

const OrderItems: React.FC<OrderItemsProps> = ({ handleItemClick, items }) => {
    const { selectedPriceId } = useSelectedItem()

    return (
        <div className="bg-white">
            <div className="mx-auto flex flex-col gap-12">
                <div className="flex place-content-center">
                    <Chip color="primary">1 </Chip>
                    <span className="mx-5 text-2xl font-bold tracking-tight text-gray-900">
                        SELECT A PLAN
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-12">
                    {items.map((product) => (
                        <Button
                            color={
                                product.priceId === selectedPriceId
                                    ? 'primary'
                                    : 'default'
                            }
                            variant="bordered"
                            key={product.priceId}
                            className={
                                'group relative flex flex-col h-full bg-zinc-100'
                            }
                            data-price-id={product.priceId} // Adding the data-price-id attribute
                            onClick={handleItemClick}
                        >
                            <Image
                                alt={product.imgAlt}
                                src={product.imgSrc}
                                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                            />

                            <div className="w-full">
                                <div className="flex justify-between px-2">
                                    <p className="text-sm text-gray-700">
                                        {product.title}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {product.price}
                                    </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    {product.description}
                                </p>
                            </div>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OrderItems
