import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

// Only run middleware on protected routes
export const config = {
    matcher: [
        '/',                 // Home page
        '/my-list/:path*',   // My List pages
        '/browse/:path*',    // Browse pages
        '/api/protected/:path*', // Any protected API
    ],
};
