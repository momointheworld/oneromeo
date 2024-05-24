import { CardSkeleton, FullSkeleton } from "@/components/posts/skeleton-loading";

export default function PostLoading() {

    return(
        <div className="gap-3">
            <FullSkeleton />
            <CardSkeleton />
        </div>
    )
}