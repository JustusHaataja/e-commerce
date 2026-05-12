import { Sequelize, Op } from "sequelize";
import { env } from "./env.js";

export { Op };

export const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
});

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✓ Database connection established");
  } catch (error) {
    console.error("✗ Unable to connect to database:", error);
    throw error;
  }
}

export async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log("✓ Database models synchronized");
  } catch (error) {
    console.error("✗ Error synchronizing database:", error);
    throw error;
  }
}