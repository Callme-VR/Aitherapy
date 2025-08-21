import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

// extends report request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer", "");
  if (!token) {
    return res.json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as any;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.json({ message: "Invalid token" });
  }
};
