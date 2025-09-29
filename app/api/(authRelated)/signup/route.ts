import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcrypt";
import connect from "@/lib/mongoose";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    const { username, email, password } = await req.json();

    // Validate input
    if (!username) return NextResponse.json({ error: "Username is required" }, { status: 400 });
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (!password) return NextResponse.json({ error: "Password is required" }, { status: 400 });

    // Connect to DB
    await connect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });

    // Create JWT payload
    const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
    );

    const response = NextResponse.json({ message: "Signed up!", token });

    // Store JWT in cookie
    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: process.env.NODE_ENV === "production" ? '/bingeboard' : '/',  // Ensure this matches your app's base path
        maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
}
