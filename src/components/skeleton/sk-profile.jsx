import { Skeleton } from "../ui/skeleton";

export default function SkProfile() {
    return (
        <div className="w-full flex gap-4 lg:gap-2 lg:flex-col">
            <Skeleton className="w-16 h-16 rounded-xl sticky top-2 lg:sticky lg:top-auto lg:rounded-3xl lg:w-28 lg:h-28 lg:mx-auto dark" />
            <div className="w-full flex flex-col items-start gap-3 lg:items-start">
                <Skeleton className="w-full h-2 rounded-md dark" />
                <Skeleton className="w-full h-2 rounded-md dark" />
                <Skeleton className="w-1/2 h-2 rounded-md dark" />
            </div>
        </div>
    )
}