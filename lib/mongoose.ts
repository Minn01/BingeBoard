import mongoose from "mongoose";

// check if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env");
}

const uri = process.env.MONGODB_URI;

// global is used to maintain a cached connection across hot reloads in development
let cached = (global as any).mongoose;

// Initialize cached if it doesn't exist
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// Function to connect to MongoDB
async function connect() {
  // Return cached connection if it exists
  if (cached.conn) return cached.conn;

  // Create a new connection promise if it doesn't exist
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((mongoose) => mongoose);
  }

  // Await the connection promise and cache the connection
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect;

