import { Sequelize } from "sequelize";
import { dbUrl } from "./app.config.js";

// Initialize Sequelize instance
const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Export sequelize instance to be used in models
export default sequelize;
