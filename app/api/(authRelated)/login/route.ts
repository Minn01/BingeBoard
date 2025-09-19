import { NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    // Parse request body
    const { email, password } = await req.json();

    // Validate input
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (!password) return NextResponse.json({ error: "Password is required" }, { status: 400 });

    // connect to DB
    await connect();

    // Find user
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    // Create JWT
    const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
    );

    const response = NextResponse.json({ message: "Logged in!", token });

    // Store JWT in cookie
    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
    });

    return response;
}
