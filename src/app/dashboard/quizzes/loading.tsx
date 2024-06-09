import {
    CardSkeleton,
    FullSkeleton,
} from '@/components/common/skeleton-loading'

export default function PostLoading() {
    return (
        <div className="gap-3">
            <CardSkeleton />
        </div>
    )
}
