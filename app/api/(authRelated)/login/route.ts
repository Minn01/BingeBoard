// app/api/login/

import { NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import User from "@/models/User";
import Session from "@/models/Session";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(req: Request) {
    // Extract email and password from request body
    const { email, password } = await req.json();

    // Generate a new session ID
    const sessionId = crypto.randomUUID();

    // Connect to the database
    await connect();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    // Create session object for the user, intended for the database
    await Session.create({
        userId: user._id,
        sessionId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
    });

    const response = NextResponse.json({ message: "Logged in!" });

    // Setting the cookie for the browser (HTTP-only)
    response.cookies.set("session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        // apparently cookies can expire automatically using the maxAge attribute here
        maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
}
