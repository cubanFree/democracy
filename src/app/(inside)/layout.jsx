import ErrorDebounce from "@/components/general/errorDebounce";
import FooterBar from "@/components/home/footerBar";
import HeaderBar from "@/components/home/headerBar";

export default function layout({ children }) {
    return (
        <main className="flex flex-col h-screen w-full overflow-hidden">
            <div className="w-full h-auto">
                <HeaderBar />
            </div>

            <div className="flex-grow overflow-auto sm:mx-[10%]">
                <ErrorDebounce>
                    {children}
                </ErrorDebounce>
            </div>

            <div className="w-full h-20">
                <FooterBar />
            </div>
        </main>
    )
}