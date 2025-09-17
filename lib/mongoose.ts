// lib/mongoose.ts - Updated version with SSL fix
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
    const opts = {
      bufferCommands: false,
      // SSL/TLS options to fix the connection error
      ssl: true,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds timeout
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', error);
      cached.promise = null; // Reset promise on error
      throw error;
    });
  }
  
  // Await the connection promise and cache the connection
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise on error
    throw e;
  }
  
  return cached.conn;
}

export default connect;