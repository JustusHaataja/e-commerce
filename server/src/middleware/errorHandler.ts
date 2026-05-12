import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("Error:", error);

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: "Validation error",
      details: error.errors,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
}

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
}
