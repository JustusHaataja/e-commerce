import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface TokenPayload {
  sub: number; // user_id
  iat?: number;
  exp?: number;
}

export function generateToken(userId: number): string {
  const payload: TokenPayload = {
    sub: userId,
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: `${env.JWT_EXPIRE_MINUTES}m`,
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as unknown as {
      sub: number;
      iat?: number;
      exp?: number;
    };
    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
}
