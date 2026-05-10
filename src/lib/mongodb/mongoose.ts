import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;

if (!uri || !dbName) {
  throw new Error(
    "MongoDB URI or DB name is not defined in the environment variables",
  );
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};
declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.mongooseCache = cached;

export const connect = async () => {
  if (cached.conn) {
    console.log("[MongoDB] Using cached connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("[MongoDB] Creating new connection promise");
    mongoose.set("strictQuery", true);

    cached.promise = mongoose.connect(uri, {
      dbName,
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
  } else {
    console.log("[MongoDB] Awaiting existing connection promise");
  }

  if (!uri) {
    throw new Error("MongoDB URI is not defined in the environment variables");
  }

  try {
    cached.conn = await cached.promise;
    console.log("[MongoDB] Connected successfully");

    return cached.conn;
  } catch (error) {
    cached.promise = null;

    console.error("[MongoDB] Connection failed:", error);

    throw error;
  }
};
