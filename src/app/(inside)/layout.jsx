import ErrorDebounce from "@/components/general/errorDebounce";
import FooterBar from "@/components/home/footerBar";
import HeaderBar from "@/components/home/headerBar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function layout({ children }) {
    return (
        <main className="flex flex-col h-screen w-full overflow-hidden">
            <div className="w-full h-auto">
                <HeaderBar />
            </div>

            <ScrollArea className="flex-grow overflow-auto sm:mx-[10%] dark">
                <ErrorDebounce>
                    {children}
                </ErrorDebounce>
            </ScrollArea>

            <div className="w-full min-h-16">
                <FooterBar />
            </div>
        </main>
    )
}