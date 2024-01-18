'use server';

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    
    // si el codigo existe, intercambiarlo por una sesion y redireccionar a home
    if (code) {
        try {
            const supabase = createRouteHandlerClient({ cookies });
            await supabase.auth.exchangeCodeForSession(code);
            return NextResponse.redirect(new URL(`/home`, request.url));
        } catch (error) {
            console.error("Error al intercambiar código por sesión:", error.message);
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // si no hay un codigo, redireccionar a la pagina de inicio
    console.error("No se proporcionó un código de intercambio");
    return NextResponse.redirect(new URL("/", request.url));
}
