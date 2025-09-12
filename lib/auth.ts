import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import User from "@/models/User";
import connect from "@/lib/mongoose";

export async function getUserFromRequest(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return null;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Connect to database and get user
    await connect();
    const user = await User.findById(decoded.userId).select("-passwordHash");
    
    return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}