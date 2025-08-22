import { Request, Response, NextFunction } from "express";
import Mood, { IMood } from "../models/Mood";
import Logger from "../utils/logger";

export const createMood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, score, note } = req.body;
    
    const newMood = new Mood({
      userId,
      score,
      note,
      timestamp: new Date()
    });

    const savedMood = await newMood.save();
    
    res.status(201).json({
      success: true,
      data: savedMood
    });
  } catch (error) {
    Logger.error('Error creating mood:', error);
    next(error);
  }
};
