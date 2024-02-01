import MenuBarMessages from "@/components/messages/menu-bar";

export default function layout({ children }) {

    return (
        <main className="grid w-full h-full p-2 gap-2 grid-rows-[1fr_50fr] md:grid-rows-1 md:grid-cols-[1fr_15fr] lg:grid-cols-[1fr_4fr]">

            <div className="relative">
                <MenuBarMessages />
            </div>

            <div className="w-full h-full rounded-xl p-2 bg-card shadow-lg overflow-hidden">
                {children}
            </div>
        </main>
    )
}