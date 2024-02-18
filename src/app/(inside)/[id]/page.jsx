import ErrorDebounce from "@/components/general/errorDebounce";
import CaseInfoManagement from "@/components/profile/caseManagement";
import CaseProfile from "@/components/profile/caseProfile";
import SkProfile from "@/components/skeleton/sk-profile";
import { Suspense } from "react";

export default function Page({ params }) {

    return (
        <main className="grid gap-4 h-full w-full p-2 relative lg:grid-cols-[2fr_5fr] overflow-y-auto scroll-custom">
            <ErrorDebounce>
                <Suspense fallback={<SkProfile />} >
                    <CaseProfile idTarget={params.id} />
                </Suspense>
            </ErrorDebounce>

            <div className="grid gap-4 md:grid-cols-2">
                <ErrorDebounce>
                    <Suspense fallback={<h3 className="w-full flex justify-center items-center h-full">Loading data Management...</h3>}>
                        <CaseInfoManagement idTarget={params.id} />
                    </Suspense>
                </ErrorDebounce>

                <div className="grid gap-4 md:grid-rows-3">
                    <div className="flex flex-col gap-4 rounded-xl p-2 bg-card shadow-lg">
                        <h1>N/A</h1>
                    </div>
                    <div className="flex flex-col gap-4 rounded-xl p-2 bg-card shadow-lg">
                        <h1>N/A</h1>
                    </div>
                    <div className="flex flex-col gap-4 rounded-xl p-2 bg-card shadow-lg">
                        <h1>N/A</h1>
                    </div>
                </div>

            </div>
        </main>
    )
}