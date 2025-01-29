import express from "express";
import { sequelize } from "./models/index.js";
import cookieParser from "cookie-parser";
import { port } from "./config/app.config.js";
import router from "./routes/_index.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
app.use(cookieParser());
app.use(express.json());

// Database setup and synchronization
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    await sequelize.sync({ alter: true }); // Use alter for development; switch to `{ force: false }` for production
    console.log("Models synchronized!");
  } catch (error) {
    console.error("Failed to connect or sync models:", error);
  }
})();

// Routing
app.use("/api", router);

// Centralized error handler
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
