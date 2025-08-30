// app/api/login/

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    const uniqueSessionId = crypto.randomUUID();

    // TODO: properly implement login

    // Logic for post method of user name and password
    // const body = await req.json();
    // const { username, password } = body;

    const response = NextResponse.json({ message: "Logged in!" });

    // Set cookie (HTTP-only)
    response.cookies.set("session", uniqueSessionId, {
        httpOnly: true,
        path: "/",
        // apparently cookies can expire automatically using the maxAge attribute here
        maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
}
