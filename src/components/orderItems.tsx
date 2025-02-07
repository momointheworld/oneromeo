import React, { MouseEventHandler } from 'react'
import { Button, Chip } from '@nextui-org/react'
import Image, { StaticImageData } from 'next/image'
import { useSelectedItem } from '@/hooks/useSelectedItem'
import EmbedVideo from './embedVideo'
import { PressEvent } from '@react-types/shared'

interface Item {
    imgSrc: StaticImageData
    imgAlt: string
    title: string
    price: string
    priceId: string
    description: string
    buttonText: string
}

interface OrderItemsProps {
    handleItemClick: (e: PressEvent) => void
    items: Item[]
}

const OrderItems: React.FC<OrderItemsProps> = ({ handleItemClick, items }) => {
    const { selectedPriceId } = useSelectedItem()

    return (
        <div className="bg-white">
            <div className="mx-auto flex flex-col gap-8 p-4">
                <h1 className="text-center text-4xl font-bold text-primary custom-font">
                    We got this. I&apos;m here, to{' '}
                    <span className="text-6xl text-orange-400">listen</span>.
                </h1>
                <div className="mx-auto w-full lg:w-1/2">
                    <EmbedVideo
                        videoId={'CGKtQ-5QlQY?si=3MIcYMYJjQfqDyRx'}
                        bvid={'BV1hmmdYNEGD'}
                    />
                </div>
                <div
                    className="flex flex-col md:flex-row justify-center items-center gap-5 custom-font my-8 "
                    id="items-section"
                >
                    <Chip
                        color="primary"
                        size="lg"
                        radius="full"
                        className="text-2xl"
                    >
                        {' '}
                        STEP 1{' '}
                    </Chip>
                    <span className="text-2xl font-bold tracking-tight text-gray-600">
                        Make a selection. Coffee or eBook?
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
                                className={`group relative flex flex-col h-30 px-4 ${bgColor}`}
                                data-price-id={product.priceId}
                                onPress={handleItemClick}
                            >
                                <Image
                                    alt={product.imgAlt}
                                    src={product.imgSrc}
                                    width={150}
                                    className="aspect-w-4 aspect-h-3 transform scale-125 h-auto w-auto"
                                    priority={index === 0} // Add priority only to the first image
                                />
                                <div className="flex flex-col h-auto px-2">
                                    <div className="flex flex-col flex-wrap space-y-0">
                                        <p className="text-gray-600 text-lg font-medium px-2">
                                            {product.title}
                                        </p>
                                        <p className="text-lg font-medium text-gray-600 px-2">
                                            {product.price}
                                            <br />
                                            <span className="text-sm text-gray-400">
                                                ( 1 US$ is about 7.77 HK$ )
                                            </span>
                                        </p>
                                    </div>

                                    <div className="mt-2 text-sm text-gray-500 flex-1 px-2">
                                        <p className="overflow-hidden overflow-ellipsis whitespace-normal">
                                            {product.description}
                                        </p>
                                    </div>
                                    <div className="my-2 text-xl">
                                        <p className="text-slate-200 bg-primary flex-1 border border-current rounded-lg p-2">
                                            {product.buttonText}
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
