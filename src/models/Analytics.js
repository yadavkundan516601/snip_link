import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Analytics extends Model {
    static associate(models) {
      this.belongsTo(models.ShortUrl, {
        foreignKey: "short_url_id",
        as: "shortUrl",
      });
    }
  }

  Analytics.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      short_url_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ip_address: {
        type: DataTypes.INET,
        allowNull: false,
      },
      os_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      device_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      geo_location: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Analytics",
      tableName: "analytics",
      timestamps: false,
    }
  );

  return Analytics;
};
