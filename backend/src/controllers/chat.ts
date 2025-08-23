import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Logger from "../utils/logger";
import { inngest } from "../inngest/index";
import { User } from "../models/User";
import { Types } from "mongoose";
import { ChatSession } from "../models/chat";

export const createChatSession = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized User",
      });
    }
    // finding the User  in database
    const userId = new Types.ObjectId(req.user.id);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: "User not Found",
      });
    }
    const sessionId = uuidv4();

    const session = new ChatSession({
      sessionId,
      userId,
      startTime: new Date(),
      status: "Active",
      message: [],
    });
    await session.save();
    return res.status(201).json({
      message: "Chat Session Created SuccessFully",
      sessionId: session.sessionId,
    });
  } catch (error: any) {
    Logger.error("Error Creating chat Session:", error);
    return res.status(500).json({
      message: "Error creating Chat session",
      error: error instanceof Error ? error.message : "Unknow Error",
    });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        
        
    } catch (error:any) {
        
    }
};
