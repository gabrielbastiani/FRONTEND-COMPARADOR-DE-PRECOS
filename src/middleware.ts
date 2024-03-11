import { NextRequest, NextResponse } from 'next/server';
import { toast } from 'react-toastify';

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};

const publicRoutes = ['/recoveryPassword', '/signup', '/login'];

export async function middleware(req: NextRequest) {

    const pathname = req.nextUrl.pathname;
    const cookies = req.cookies.get('@comparador.token')?.value;

    const route_public = publicRoutes.includes(pathname);
    const cookie_ok = !!cookies;

    if (route_public === true && cookie_ok === true) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    if (!cookies) {

        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();

}