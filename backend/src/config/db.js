import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongodInstance;

export const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  // First try connecting to configured URI (if any). If it fails, fall back to in-memory.
  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log("MongoDB connected to", uri);
      return;
    } catch (err) {
      console.warn(`Failed to connect to MONGO_URI (${uri}): ${err.message}`);
      console.warn("Falling back to in-memory MongoDB for development");
    }
  } else {
    console.warn("MONGO_URI not set — starting in-memory MongoDB for development");
  }

  // Start in-memory MongoDB and connect
  mongodInstance = await MongoMemoryServer.create();
  globalThis.__MONGOD_INSTANCE__ = mongodInstance;
  uri = mongodInstance.getUri();
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log("MongoDB connected (in-memory)");
};

export const stopInMemoryMongo = async () => {
  if (mongodInstance) {
    await mongodInstance.stop();
    mongodInstance = null;
    delete globalThis.__MONGOD_INSTANCE__;
  }
};
