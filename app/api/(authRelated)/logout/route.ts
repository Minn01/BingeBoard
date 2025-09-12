// app/api/logout/

import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/mongoose";
import Session from "@/models/Session";

export async function POST(req: NextRequest) {
  // Extract session ID from cookies
  const sessionId = req.cookies.get("session")?.value;

  // If no session ID, return early
  if (!sessionId) return NextResponse.json({ message: "No session found" });

  // Connect to the database and delete the session
  await connect();
  await Session.deleteOne({ sessionId });

  // Clear the cookie in the browser
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("session", "", {
    path: "/",
    maxAge: 0
  });

  return response;
}
