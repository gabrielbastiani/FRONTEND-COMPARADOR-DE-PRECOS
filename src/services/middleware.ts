/* eslint-disable react-hooks/rules-of-hooks */
import { NextRequest, NextResponse } from 'next/server';
import { useContext } from 'react';

import { AuthContext } from '../contexts/AuthContext';

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};

const publicRoutes = ['/recoveryPassword', '/signup', '/login'];

export async function middleware(req: NextRequest) {
    
    const { isAuthenticated } = useContext(AuthContext);

    console.log(req.nextUrl);

    const pathname = req.nextUrl.pathname;

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    if (!isAuthenticated) {
        const isAPIRoute = pathname.startsWith('/api');

        if (isAPIRoute) {
            return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
        }

        return NextResponse.redirect(new URL('/portal/login', req.url));
    }

    return NextResponse.next();
}