import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the JWT cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.ALLOW_HTTPS === 'true', // Set to true if using HTTPS
    path: "/bingeboard",  // Change from "/" to "/bingeboard for development"
    maxAge: 0, // Expire the cookie immediately
  });

  return response;
}