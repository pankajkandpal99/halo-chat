import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    console.error(
      "Error: MONGODB_URL is not defined in environment variables."
    );
    return;
  }

  if (isConnected) {
    // console.log("MongoDB is already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true;
    // console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};
