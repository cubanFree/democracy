import CaseMap from "@/components/profile/caseMap";
import CaseProfile from "@/components/profile/caseProfile";

export default function Profile() {

    return (
        <main className="grid gap-4 h-full w-full p-2 lg:grid-cols-[1fr_3fr]">
            <CaseProfile />
            
            <div className="grid grid-rows-3 gap-4">
                {/* Mostrar el mapa de la empresa */}
                <CaseMap />

                {/* Mostrar las mediciones estadisticas de la empresa */}
                <div className="grid grid-cols-3 gap-4">
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