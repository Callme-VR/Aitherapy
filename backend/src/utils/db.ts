import mongoose from "mongoose";
import dotenv from "dotenv";
import Logger from "./logger";

// Load environment variables
dotenv.config();

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        Logger.error("❌ MONGODB_URI is not set in .env file");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        Logger.info("✅ MongoDB connected successfully");
    } catch (error) {
        Logger.error(`❌ MongoDB connection failed: ${error}`);
        process.exit(1);
    }
};

export default connectDB;
