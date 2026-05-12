import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "express-async-errors";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: [env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ success: true, message: "E-commerce backend API" });
});

app.get("/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app