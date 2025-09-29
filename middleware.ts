import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const BASE_PATH = '/bingeboard';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL(`${BASE_PATH}/login`, req.url));
    }

    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL(`${BASE_PATH}/login`, req.url));
    }
}

export const config = {
    matcher: [
        '/',
        '/my-list/:path*',
        '/browse/:path*',
        '/api/protected/:path*',
    ],
};