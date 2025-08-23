import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { inngest } from "../inngest/index";
import { IChatMessage, IChatSession } from "../models/chat";
import { ChatSession } from "../models/chat";
import { User } from "../models/User";
import logger from "../utils/logger";

// Define the InngestEvent type locally since we're having module resolution issues
interface InngestEvent {
  name: string;
  data: {
    message: string;
    sessionId: string;
    userId: string;
    timestamp?: Date;
    history?: any[];
    memory?: {
      userProfile?: {
        emotionalState?: any[];
        riskLevel?: number;
        preferences?: Record<string, any>;
      };
      sessionContext?: {
        conversationThemes?: any[];
        currentTechnique?: string | null;
      };
    };
    goals?: any[];
    systemPrompt?: string;
  };
}

// Initialize Google's Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// --- Create Chat Session ---
export const createChatSession = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const userId = new Types.ObjectId(req.user.id);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const sessionId = uuidv4();
    const session = new ChatSession({
      sessionId,
      userId,
      startTime: new Date(),
      status: "Active",
      messages: [], // Ensure it's messages array
    });

    await session.save();

    return res.status(201).json({
      message: "Chat Session Created Successfully",
      sessionId: session.sessionId,
    });
  } catch (error: any) {
    logger.error("Error Creating chat Session:", error);
    return res.status(500).json({
      message: "Error creating Chat session",
      error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};

// --- Send Message ---
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const userId = new Types.ObjectId(req.user.id);
    logger.info("Processing message:", { sessionId, message });

    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Inngest event
    const event: InngestEvent = {
      name: "therapy/session.message",
      data: {
        message,
        history: session.messages,
        memory: {
          userProfile: { emotionalState: [], riskLevel: 0, preferences: {} },
          sessionContext: { conversationThemes: [], currentTechnique: null },
        },
        goals: [],
        systemPrompt: `You are an AI therapist assistant. Your role is to:
  1. Provide empathetic and supportive responses
  2. Use evidence-based therapeutic techniques
  3. Maintain professional boundaries
  4. Monitor for risk factors
  5. Guide users toward their therapeutic goals`,
        sessionId: session.sessionId,
        userId: session.userId.toString(),
      },
    };

    await inngest.send(event);

    // Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Analysis
    const analysisPrompt = `Analyze this therapy message and provide insights. Return ONLY valid JSON.
  Message: ${message}
  Context: ${JSON.stringify({
    memory: event.data.memory,
    goals: event.data.goals,
  })}
  Required JSON structure:
  {
    "emotionalState": "string",
    "themes": ["string"],
    "riskLevel": number,
    "recommendedApproach": "string",
    "progressIndicators": ["string"]
  }`;

    const analysisResult = await model.generateContent(analysisPrompt);
    const analysisText = analysisResult.response.text().trim();
    const cleanAnalysisText = analysisText
      .replace(/```json\n|\n```/g, "")
      .trim();

    let analysis;
    try {
      analysis = JSON.parse(cleanAnalysisText);
    } catch {
      analysis = {
        emotionalState: "unknown",
        themes: [],
        riskLevel: 0,
        recommendedApproach: "",
        progressIndicators: [],
      };
    }

    // Therapeutic response
    const responsePrompt = `${event.data.systemPrompt}
  
  Message: ${message}
  Analysis: ${JSON.stringify(analysis)}
  Memory: ${JSON.stringify(event.data.memory)}
  Goals: ${JSON.stringify(event.data.goals)}
  
  Provide a therapeutic response that:
  1. Addresses emotional needs
  2. Uses appropriate techniques
  3. Shows empathy
  4. Maintains boundaries
  5. Considers safety`;

    const responseResult = await model.generateContent(responsePrompt);
    const response = responseResult.response.text().trim();

    // Save conversation
    session.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    const assistantMessage: IChatMessage = {
      role: "assistant",
      content: response,
      timestamp: new Date(),
      metadata: {
        analysis: {
          emotionalState: analysis.emotionalState || "",
          themes: analysis.themes || [],
          riskLevel: analysis.riskLevel || 0,
          recommendedApproach: analysis.recommendedApproach || "",
          progressIndicators: analysis.progressIndicators || [],
        },
        technique: "",
        goal: "",
        progress: [],
      },
    };
    session.messages.push(assistantMessage);

    await session.save();

    return res.json({
      response,
      analysis,
      metadata: {
        progress: {
          emotionalState: analysis.emotionalState,
          riskLevel: analysis.riskLevel,
        },
      },
    });
  } catch (error: any) {
    logger.error("Error in sendMessage:", error);
    return res.status(500).json({
      message: "Error processing message",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getSessionHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = new Types.ObjectId(req.user.id);
    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    return res.status(200).json({
      messages: session.messages,
      startTime: session.startTime,
      status: session.status,
    });
  } catch (error) {
    logger.error("Error in getSessionHistory:", error);
    return res.status(500).json({
      message: "Error getting session history",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export const getChatSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    logger.info(`Getting chat session: ${sessionId}`);
    const chatSession = await ChatSession.findOne({ sessionId });
    if (!chatSession) {
      logger.info(`Chat Session not found:${sessionId}`);
      return res.status(401).json({
        message: "Chat Session not found",
      });
    }
    logger.info(`Found chat Session:${sessionId}`);
    return res.status(200).json({
      chatSession,
    });
  } catch (error) {
    logger.error("Error in getChatSession:", error);
    return res.status(500).json({
      message: "Error getting chat session",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = new Types.ObjectId(req.user.id);
    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return res
        .status(401)
        .json({ message: "Chat Session history not found" });
    }
    if (session.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({
      messages: session.messages,
    });
  } catch (error) {
    logger.error("Error in getChatHistory:", error);
    return res.status(500).json({
      message: "Error getting chat history",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
