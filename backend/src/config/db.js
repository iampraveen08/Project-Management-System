import mongoose from "mongoose";

const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017/project_management_system";

export const connectDB = async () => {
  const envUri = process.env.MONGO_URI?.trim();
  const uri = envUri || DEFAULT_LOCAL_URI;

  if (!envUri) {
    console.warn(
      `MONGO_URI is not set. Defaulting to local MongoDB at ${DEFAULT_LOCAL_URI}. ` +
        "Set MONGO_URI in backend/.env to use a different database."
    );
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected to", uri);
  } catch (err) {
    console.error(`Failed to connect to MongoDB at ${uri}: ${err.message}`);
    console.error(
      "Make sure MongoDB is running on localhost:27017 or set a valid MONGO_URI in backend/.env."
    );
    throw err;
  }
};
