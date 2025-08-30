// app/api/logout/

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

   // TODO: properly implement logout

  // Delete the session cookie
  response.cookies.set("session", "", {
    path: "/",      // same path as the cookie was set
    maxAge: 0,      // expire immediately
  });

  return response;
}
