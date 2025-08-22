import e, { Request, Response, NextFunction } from "express";
import { Activity, IActivity } from "../models/Activity";
import logger from "../utils/logger";

export const logActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, name, description, difficulty, duration } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "user not authenticated" });
    }
    const activity = new Activity({
      type,
      name,
      description,
      difficulty,
      duration,
      timestamp: new Date(),
    });
    await activity.save();
    logger.info(`Activity logged for User ${userId}`);
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};
