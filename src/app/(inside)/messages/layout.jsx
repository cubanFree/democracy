import ErrorDebounce from "@/components/general/errorDebounce";
import MenuBarMessages from "@/components/messages/menu-bar";

export default function layout({ children }) {

    return (
        <main className="grid w-full h-full p-2 gap-2 md:grid-rows-1 md:grid-cols-[1fr_15fr] lg:grid-cols-[1fr_4fr]">

            <div className="relative hidden md:block">
                <MenuBarMessages />
            </div>

            <div className="w-full h-full rounded-xl bg-card overflow-hidden">
                <ErrorDebounce>
                    {children}
                </ErrorDebounce>
            </div>
        </main>
    )
}