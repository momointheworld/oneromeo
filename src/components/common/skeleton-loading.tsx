import React from 'react'
import { Card, Skeleton } from '@nextui-org/react'

const FullSkeleton = () => {
    return (
        <div>
            <div className="flex flex-col gap-10">
                <div className="space-y-5 w-full flex flex-col gap-2 ">
                    <Skeleton className="h-3 w-1/2 rounded-lg" />
                    <Skeleton className="h-3 w-full rounded-lg" />
                    <Skeleton className="h-3 w-full rounded-lg" />
                </div>
                <div className="space-y-5 w-full flex flex-col gap-2 ">
                    <Skeleton className="h-3 w-1/2 rounded-lg" />
                    <Skeleton className="h-3 w-full rounded-lg" />
                    <Skeleton className="h-3 w-full rounded-lg" />
                </div>
            </div>
        </div>
    )
}

const CardSkeleton = () => {
    return (
        <div className="flex justify-center">
            <div className="w-[500px] space-y-5 p-4">
                <Skeleton className="rounded-lg">
                    <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div className="space-y-3">
                    <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                </div>
            </div>
        </div>
    )
}

export { FullSkeleton, CardSkeleton }
