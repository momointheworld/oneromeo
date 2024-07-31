// import React, { MouseEventHandler, useEffect, useState } from 'react'
// import { Button, Chip } from '@nextui-org/react'
// import Image, { StaticImageData } from 'next/image'
// import { useSelectedItem } from '@/hooks/useSelectedItem'

// interface Item {
//     imgSrc: StaticImageData
//     imgAlt: string
//     title: string
//     price: string
//     priceId: string
//     description: string
// }

// interface OrderItemsProps {
//     handleItemClick: MouseEventHandler<HTMLButtonElement>
//     items: Item[]
// }

// const OrderItems: React.FC<OrderItemsProps> = ({ handleItemClick, items }) => {
//     const { selectedPriceId } = useSelectedItem()

//     return (
//         <div className="bg-white">
//             <div className="mx-auto flex flex-col gap-12">
//                 <h1>We got this. I&apos;m here, to listen.</h1>
//                 <div className="flex place-content-center">
//                     <Chip color="primary">1 </Chip>
//                     <span className="mx-5 text-2xl font-bold tracking-tight text-gray-900">
//                         Choose: Coffee or eBook
//                     </span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row justify-center gap-12">
//                     {items.map((product) => (
//                         <Button
//                             color={
//                                 product.priceId === selectedPriceId
//                                     ? 'primary'
//                                     : 'default'
//                             }
//                             variant="bordered"
//                             key={product.priceId}
//                             className={
//                                 'group relative flex flex-col h-full bg-zinc-100'
//                             }
//                             data-price-id={product.priceId} // Adding the data-price-id attribute
//                             onClick={handleItemClick}
//                         >
//                             <Image
//                                 alt={product.imgAlt}
//                                 src={product.imgSrc}
//                                 className="h-full w-full object-cover object-center lg:h-full lg:w-full"
//                             />

//                             <div className="w-full">
//                                 <div className="flex justify-between px-2">
//                                     <p className="text-sm text-gray-700">
//                                         {product.title}
//                                     </p>
//                                     <p className="text-sm font-medium text-gray-900">
//                                         {product.price}
//                                     </p>
//                                 </div>
//                                 <p className="mt-1 text-sm text-gray-500 text-wrap">
//                                     {product.description}
//                                 </p>
//                             </div>
//                         </Button>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default OrderItems

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

const OrderItems: React.FC<OrderItemsProps> = ({ handleItemClick, items }) => {
    const { selectedPriceId } = useSelectedItem()

    return (
        <div className="bg-white">
            <div className="mx-auto flex flex-col gap-12 p-4">
                <h1 className="text-center text-3xl font-bold text-gray-600">
                    We got this. I&apos;m here, to listen.
                </h1>
                <div className="flex justify-center items-center gap-5">
                    <Chip color="primary">1</Chip>
                    <span className="text-2xl font-bold tracking-tight text-gray-600">
                        Choose: Coffee or eBook
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-3">
                    {items.map((product, index) => {
                        // Determine the background color based on the index
                        let bgColor
                        if (index === 0) bgColor = 'bg-amber-100'
                        else if (index === 1) bgColor = 'bg-zinc-100'
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
