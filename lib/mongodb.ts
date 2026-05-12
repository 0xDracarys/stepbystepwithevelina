import { MongoClient, type Db } from "mongodb"
import mongoose from "mongoose"

const uri = process.env.MONGODB_URI || ""
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient> | null = null

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (globalWithMongo._mongoClientPromise) {
    clientPromise = globalWithMongo._mongoClientPromise
  }
} else {
  // In production mode, we will initialize it lazily in getDatabase
}

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }
  
  try {
    if (mongoose.connections[0].readyState) {
      return mongoose.connections[0]
    }

    await mongoose.connect(process.env.MONGODB_URI!)
    console.log("Connected to MongoDB via Mongoose")
    return mongoose.connections[0]
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export async function getDatabase(): Promise<Db> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }

  if (!clientPromise) {
    client = new MongoClient(process.env.MONGODB_URI, options)
    clientPromise = client.connect()
    
    if (process.env.NODE_ENV === "development") {
      const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
      }
      globalWithMongo._mongoClientPromise = clientPromise
    }
  }

  const resolvedClient = await clientPromise
  return resolvedClient.db("elearning_platform")
}

// Ensure backward compatibility if clientPromise was exported directly
// Note: In lazy mode, this might be null initially.
export default clientPromise
