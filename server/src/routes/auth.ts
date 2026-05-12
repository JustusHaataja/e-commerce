import { Router } from "express";
import { User, CartItem } from "../models/index.js";
import { registerSchema, loginSchema } from "../utils/validation.js";
import { hashPassword, verifyPassword, generateToken } from "../utils/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { AuthRequest, authMiddleware } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

// POST /auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    // Validate input
    const validation = registerSchema.safeParse({ email, name, password });
    if (!validation.success) {
      return sendError(res, "Invalid input data", 400);
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendError(res, "Email already registered", 400);
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email,
      name,
      password_hash: passwordHash,
    });

    // Generate token and set cookie
    const token = generateToken(user.id);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Clear guest cookie if exists
    res.clearCookie("guest_id");

    return sendSuccess(
      res,
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      201
    );
  } catch (error) {
    next(error);
  }
});

// POST /auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      return sendError(res, "Invalid input data", 400);
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return sendError(res, "Invalid credentials", 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return sendError(res, "Invalid credentials", 401);
    }

    // Merge guest cart into user cart
    const guestId = req.cookies.guest_id;
    if (guestId) {
      const guestItems = await CartItem.findAll({
        where: { guest_id: guestId },
      });

      for (const guestItem of guestItems) {
        const existingItem = await CartItem.findOne({
          where: {
            user_id: user.id,
            product_id: guestItem.product_id,
          },
        });

        if (existingItem) {
          // Aggregate quantities
          existingItem.quantity += guestItem.quantity;
          await existingItem.save();
          await guestItem.destroy();
        } else {
          // Move guest item to user
          guestItem.user_id = user.id;
          guestItem.guest_id = null;
          await guestItem.save();
        }
      }
    }

    // Generate token and set cookie
    const token = generateToken(user.id);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Clear guest cookie
    res.clearCookie("guest_id");

    return sendSuccess(res, {
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    next(error);
  }
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("guest_id");
  return sendSuccess(res, { message: "Logged out successfully" });
});

// GET /auth/me
router.get("/me", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    if (!req.userId) {
      return sendError(res, "Not authenticated", 401);
    }

    const user = await User.findByPk(req.userId, {
      attributes: ["id", "email", "name"],
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
});

export default router