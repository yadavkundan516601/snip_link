import dotenv from "dotenv";
import { requiredEnvVars } from "./constants.js";

/**
 * Loads and validates environment variables
 * @throws {Error} If environment variables are missing or invalid
 */
function loadEnvironmentVariables() {
  const result = dotenv.config();

  if (result.error) {
    throw new Error(
      `Failed to load environment variables ${result.error.message}`
    );
  }
}

/**
 * Validates required environment variables
 * @throws {Error} If any required variables are missing
 */
function validateRequiredVariables() {
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
  }
}

/**
 * Validates and parses the port number
 * @returns {number} The validated port number
 * @throws {Error} If port is invalid
 */
function validatePort() {
  const port = parseInt(process.env.PORT || "3000", 10);

  if (isNaN(port) || port < 0 || port > 65535) {
    throw new Error("Invalid PORT value");
  }

  return port;
}

// Initialize environment
loadEnvironmentVariables();
validateRequiredVariables();

// Configuration object with all environment variables
export const config = {
  port: validatePort(),
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  nodeEnv: process.env.NODE_ENV || "development",
  dbUrl: process.env.DB_URL,
  googleRedirectUrl: process.env.GOOGLE_REDIRECT_URL,
};

export const {
  port,
  googleClientId,
  googleClientSecret,
  nodeEnv,
  dbUrl,
  googleRedirectUrl,
} = config;

// Default export for the entire config object
export default config;
