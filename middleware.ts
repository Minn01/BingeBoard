import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // get session cookie
    const session = req.cookies.get("session")?.value;
    
    if (!session && req.nextUrl.pathname === "/") {
        console.log("No session cookie found but trying to access home");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If authenticated and trying to access login or signup, redirect to home
    return NextResponse.next();
}