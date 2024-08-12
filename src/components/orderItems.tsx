import React, { MouseEventHandler } from 'react'
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

type PopoverContentProps = {
    children: React.ReactNode
}

const OrderItems: React.FC<OrderItemsProps> = ({ handleItemClick, items }) => {
    const { selectedPriceId } = useSelectedItem()

    return (
        <div className="bg-white">
            <div className="mx-auto flex flex-col gap-12 p-4">
                <h1 className="text-center text-3xl font-bold text-primary">
                    We got this. I&apos;m here, to listen.
                </h1>
                <div className="flex justify-center items-center gap-5">
                    <Chip color="primary" size="lg" radius="full">
                        {' '}
                        1{' '}
                    </Chip>
                    <span className="text-2xl font-bold tracking-tight text-gray-600">
                        What&apos;s it going to be? Coffee or eBook?
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-3">
                    {items.map((product, index) => {
                        // Determine the background color based on the index
                        let bgColor
                        if (index === 0) bgColor = 'bg-warning-200'
                        else if (index === 1) bgColor = 'bg-warning-100'
                        else bgColor = 'bg-stone-100'

                        return (
                            <Button
                                variant={
                                    product.priceId === selectedPriceId
                                        ? 'bordered'
                                        : 'flat'
                                }
                                color={
                                    product.priceId === selectedPriceId
                                        ? 'warning'
                                        : 'default'
                                }
                                key={product.priceId}
                                className={`group relative flex flex-col h-full px-4 ${bgColor}`}
                                data-price-id={product.priceId}
                                onClick={handleItemClick}
                            >
                                <Image
                                    alt={product.imgAlt}
                                    src={product.imgSrc}
                                    width={150}
                                    className="aspect-w-4 aspect-h-3"
                                />
                                <div className="flex flex-col h-auto px-2">
                                    <div className="flex flex-col flex-wrap space-y-0">
                                        <p className="text-gray-600 text-lg font-medium px-2">
                                            {product.title}
                                        </p>
                                        <p className="text-lg font-medium text-gray-600 px-2">
                                            {product.price}
                                        </p>
                                    </div>

                                    <div className="mt-2 text-sm text-gray-500 flex-1 px-2">
                                        <p className="overflow-hidden overflow-ellipsis whitespace-normal">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>
                            </Button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default OrderItems
