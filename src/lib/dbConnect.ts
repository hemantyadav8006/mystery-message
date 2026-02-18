import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Please set it in your environment variables."
    );
  }

  try {
    const db = await mongoose.connect(uri);
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error("[DB] Connection failed:", error);
    throw new Error("Failed to connect to database");
  }
}

export default dbConnect;
