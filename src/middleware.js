import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
    
    const res = NextResponse.next();
    const currentPath = req.nextUrl.pathname;
    const PROTECTED_ROUTES = ['/home'];
    console.log('[ middleware-Path ]', currentPath);
    
    try {
        const supabase = createMiddlewareClient({ req, res });
        const { data: { session } } = await supabase.auth.getSession();
        console.log('[ Session ]', session ? true : false);

        // Redirigir usuarios no autenticados que intentan acceder a '/home'
        if (!session && PROTECTED_ROUTES.includes(currentPath)) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        // (Opcional) Redirigir usuarios autenticados que acceden a '/' a una ruta protegida
        if (session && currentPath === '/') {
            return NextResponse.redirect(new URL('/home', req.url));
        }

    } catch (error) {
        console.log('[ ERROR middleware ]', error.message);
    }

    return res;
}

export const config = {
    matcher: ['/', '/home']
}
