// lib/db.ts
import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URI as string;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Invalid/Missing environment variable: "DATABASE_URI"');
}

if (process.env.NODE_ENV === "development") {
  // In dev, store the promise globally to avoid creating many connections
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
