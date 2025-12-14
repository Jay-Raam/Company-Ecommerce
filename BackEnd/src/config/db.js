import "dotenv/config";

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const databaseUrl = process.env.MONGODB_DATABASE;

    await mongoose.connect(databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
