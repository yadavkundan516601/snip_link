import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class ShortUrl extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      this.hasMany(models.Analytics, {
        foreignKey: "short_url_id",
        as: "analytics",
      });
    }
  }

  ShortUrl.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      long_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      short_url: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      custom_alias: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ShortUrl",
      tableName: "short_urls",
      timestamps: false,
    }
  );

  return ShortUrl;
};
