import ErrorDebounce from "@/components/general/errorDebounce";
import FooterBar from "@/components/home/footerBar";
import HeaderBar from "@/components/home/headerBar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function layout({ children }) {
    
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    return (
        <main className="flex flex-col h-screen w-full overflow-hidden">
            <div className="w-full h-auto">
                <HeaderBar />
            </div>

            <div className="flex-grow h-full dark overflow-hidden lg:mx-[10%]">
                <ErrorDebounce>
                    {children}
                </ErrorDebounce>
            </div>

            <div className="w-full min-h-14">
                <FooterBar idHost={user?.id} />
            </div>
        </main>
    )
}