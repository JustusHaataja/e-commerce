import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "../utils/auth.js";
import { User } from "../models/index.js";

export interface AuthRequest extends Request {
  userId?: number;
  guestId?: string;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies.access_token;

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.userId = payload.sub;
      return next();
    }
  }

  // No valid token - set guest_id if not already set
  let guestId = req.cookies.guest_id;
  if (!guestId) {
    guestId = uuidv4();
    res.cookie("guest_id", guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });
  }
  req.guestId = guestId;
  next();
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.userId) {
    res.status(401).json({
      success: false,
      error: "Unauthorized - please login",
    });
    return;
  }
  next();
}

export async function getCurrentUser(
  req: AuthRequest
): Promise<User | null> {
  if (!req.userId) {
    return null;
  }

  return User.findByPk(req.userId);
}
