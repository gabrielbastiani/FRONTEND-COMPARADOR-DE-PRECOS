import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {

    const pathname = req.nextUrl.pathname;

    const isPublicPath = pathname === '/recoveryPassword' || pathname === '/signup' || pathname === '/login' || pathname === `/recover${pathname.replace("/recover", "")}`

    const token = req.cookies.get('@comparador.token')?.value || '';

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    return NextResponse.next();

}

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};