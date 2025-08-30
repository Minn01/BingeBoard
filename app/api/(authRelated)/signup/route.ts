// app/api/signup/

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    const uniqueSessionId = crypto.randomUUID();

    // TODO: properly implement signup

    // Logic for post method of user name and password
    // const body = await req.json();
    // const { username, password } = body;

    const response = NextResponse.json({ message: "Signed up!" });

    // Set cookie (HTTP-only)
    response.cookies.set("session", uniqueSessionId, {
        httpOnly: true,
        path: "/",
        // apparently cookies can expire automatically using the maxAge attribute here
        maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
}
