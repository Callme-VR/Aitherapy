// src/index.ts
import express from "express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index";
import Logger from "./utils/logger";
import connectDB from "./utils/db";

// No dotenv — load env variables if already available in process.env

const app = express();

// Middleware
app.use(express.json());

// Inngest endpoint
app.use("/api/inngest", serve({ client: inngest, functions }));

// Start server
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            Logger.info(`🚀 Server running at http://localhost:${PORT}`);
            Logger.info(`📡 Inngest endpoint: http://localhost:${PORT}/api/inngest`);
        });
    } catch (error) {
        Logger.error(`❌ Failed to start server: ${(error as Error).message}`);
        process.exit(1);
    }
};

startServer();
