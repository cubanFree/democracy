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

export function SkProfileInbox() {
    return (
        <div className="w-full flex items-start gap-4 p-2">
            <Skeleton className="w-14 h-11 rounded-xl dark" />
            <div className="w-full flex justify-between items-start gap-1">
                <div className="w-full flex flex-col justify-between gap-2">
                    <Skeleton className="w-16 h-2 rounded-xl dark" />
                    <Skeleton className="w-12 h-2 rounded-xl dark" />
                </div>
                <Skeleton className="w-8 h-2 rounded-xl dark" />
            </div>
        </div>
    )
}