'use client'

import React, { Suspense } from 'react'
import { FullSkeleton } from '@/components/common/skeleton-loading'
import ReviewPageContent from '@/components/reviewPageContent'

export default function ReviewPage() {
    return (
        <Suspense fallback={<FullSkeleton />}>
            <ReviewPageContent />
        </Suspense>
    )
}

//wrap the component with Suspense due to useSearchparams for the token
