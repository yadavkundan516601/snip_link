import bcrypt from "bcryptjs";
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.ShortUrl, { foreignKey: "user_id", as: "shortUrls" });
      this.hasOne(models.RateLimit, { foreignKey: "user_id", as: "rateLimit" });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      google_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: false,
    }
  );

  // Method to set the encrypted refresh token
  User.prototype.setRefreshToken = async function (refreshToken) {
    try {
      // Ensure refreshToken is a string
      if (typeof refreshToken !== "string") {
        throw new Error("Refresh token must be a string");
      }

      const salt = await bcrypt.genSalt(10);
      const encryptedToken = await bcrypt.hash(refreshToken, salt);
      this.refresh_token = encryptedToken;
      await this.save();
      return true;
    } catch (error) {
      console.error("Error setting refresh token:", error);
      throw error;
    }
  };

  // Method to check if the refresh token is valid
  User.prototype.isRefreshTokenValid = async function (refreshToken) {
    try {
      // Ensure refreshToken is a string
      if (typeof refreshToken !== "string") {
        throw new Error("Refresh token must be a string");
      }

      // Check if refresh_token exists in the database
      if (!this.refresh_token) {
        return false;
      }

      // Compare the provided token with stored hash
      return await bcrypt.compare(refreshToken, this.refresh_token);
    } catch (error) {
      console.error("Error validating refresh token:", error);
      return false;
    }
  };

  return User;
};
