import app from "./app.js";
import { env } from "./config/env.js";
import { initializeDatabase, sequelize } from "./config/database.js";
import { setupAssociations } from "./models/associations.js";

async function start() {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Setup model associations
    setupAssociations();
    
    // Sync database models
    await sequelize.sync({ alter: true });
    console.log("✓ Database models synchronized");

    // Start server
    app.listen(env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();