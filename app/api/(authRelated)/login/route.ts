import { NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";  // ✅ Changed from "bcrypt"
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        // Parse request body
        const { email, password } = await req.json();
        console.log("Login attempt for email:", email);

        // Validate input
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }
        if (!password) {
            return NextResponse.json({ error: "Password is required" }, { status: 400 });
        }

        // Connect to DB
        await connect();

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        console.log("User found:", user.email);

        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        console.log("Password verified for user:", user.email);

        // Create JWT
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );
        console.log("JWT created for user:", user.email);

        const response = NextResponse.json({ message: "Logged in!", token });

        // Store JWT in cookie with basePath
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.ALLOW_HTTPS === 'true', // Set to true if using HTTPS
            path: `${process.env.NEXT_PUBLIC_BASE_PATH}/`, // Change from "/" to "/bingeboard" for development
            maxAge: 60 * 60 * 24,
        });
        console.log("JWT stored in cookie for user:", user.email);

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "An error occurred during login" },
            { status: 500 }
        );
    }
}
