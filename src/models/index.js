import sequelize from "../config/db.config.js";
import User from "./User.js";
import ShortUrl from "./ShortUrl.js";
import Analytics from "./Analytics.js";
import RateLimit from "./RateLimit.js";

const models = {
  User: User(sequelize),
  ShortUrl: ShortUrl(sequelize),
  Analytics: Analytics(sequelize),
  RateLimit: RateLimit(sequelize),
};

// Setup associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize, models };
