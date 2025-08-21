import { Request, Response, NextFunction } from "express";
import Logger from "../utils/logger";

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperation: boolean;
}

export const errorHandler = (err: Error, req: Request, res: Response) => {
    
};
