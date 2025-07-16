import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

interface MulterError extends Error {
  code: string;
  field: string;
}

export const errorHandler = (
  err: Error | AppError | MulterError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const message = "Duplicate field value entered";
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values((err as any).errors).map(
      (val) => (val as Error).message,
    );
    error = new AppError(message.join(", "), 400);
  }

  // Multer error
  if ((err as MulterError).code === "LIMIT_FILE_SIZE") {
    const message = "File size is too large. Maximum size is 5MB";
    error = new AppError(message, 400);
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again";
    error = new AppError(message, 401);
  }

  // JWT expired
  if (err.name === "TokenExpiredError") {
    const message = "Your token has expired. Please log in again";
    error = new AppError(message, 401);
  }

  res.status((error as AppError).statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
