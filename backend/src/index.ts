// src/index.ts
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index";
import Logger from "./utils/logger";
import connectDB from "./utils/db";
import authRoutes from "./routes/auth";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import chatRouter from "./routes/chat";
import moodRouter from "./routes/mood";
import activityRouter from "./routes/activity";
// No dotenv — load env variables if already available in process.env

const app = express();

// Middleware

// Configure CORS to allow all origins in development
const corsOptions = {
  origin: '*', // In production, replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Inngest endpoint
app.use("/api/inngest", serve({ client: inngest, functions }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRouter);
app.use("/api/mood", moodRouter);
app.use("/api/activity", activityRouter);

app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      const address = server.address();
      const host = typeof address === 'string' ? address : `http://localhost:${PORT}`;
      Logger.info(`🚀 Server running at ${host}`);
      Logger.info(`📡 Inngest endpoint: ${host}/api/inngest`);
    });
  } catch (error) {
    Logger.error(`❌ Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
};

startServer();
