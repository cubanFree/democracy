import ErrorDebounce from "@/components/general/errorDebounce";
import CaseMap from "@/components/profile/caseMap";
import CaseProfile from "@/components/profile/caseProfile";
import { Suspense } from "react";

export default function Profile() {

    return (
        <main className="grid gap-4 h-full w-full p-2 lg:grid-cols-[2fr_5fr]">
            <ErrorDebounce>
                <Suspense fallback={<div>Cargando...</div>}>
                    <CaseProfile />
                </Suspense>
            </ErrorDebounce>
            
            <div className="grid grid-rows-3 gap-4">
                {/* Mostrar el mapa de la empresa */}
                <CaseMap />

                {/* Mostrar las mediciones estadisticas de la empresa */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-lg p-2 bg-green-origin shadow-lg">
                        <h1>Estadisticas</h1>
                    </div>
                    <div className="rounded-lg p-2 bg-green-origin shadow-lg">
                        <h1>Mapa</h1>
                    </div>
                    <div className="rounded-lg p-2 bg-green-origin shadow-lg">
                        <h1>Trade</h1>
                    </div>
                </div>
            </div>
        </main>
    )
}