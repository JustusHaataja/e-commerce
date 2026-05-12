import dotenv from "dotenv";

dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost/ecommerce",
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret_key",
  JWT_EXPIRE_MINUTES: parseInt(process.env.JWT_EXPIRE_MINUTES || "1440"),
  PORT: parseInt(process.env.PORT || "3000"),
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";