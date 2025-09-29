import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the JWT cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: process.env.NODE_ENV === "production" ? '/bingeboard' : '/', // Ensure this matches the login path
    maxAge: 0, // Expire the cookie immediately
  });

  return response;
}