import ErrorDebounce from "@/components/general/errorDebounce";
import MenuBarMessages from "@/components/messages/menu-bar";
import { Suspense } from "react";

export default function layout({ children }) {

    return (
        <main className="grid w-full h-full p-2 gap-2 grid-rows-[1fr_50fr] md:grid-rows-1 md:grid-cols-[1fr_15fr] lg:grid-cols-[1fr_4fr]">

            <div className="relative">
                <MenuBarMessages />
            </div>

            <div className="w-full h-full rounded-xl bg-card overflow-hidden">
                <ErrorDebounce>
                    <Suspense fallback={<h1>Loading...</h1>}>
                        {children}
                    </Suspense>
                </ErrorDebounce>
            </div>
        </main>
    )
}