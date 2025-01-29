import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class RateLimit extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    }
  }

  RateLimit.init(
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
      requests_made: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      reset_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RateLimit",
      tableName: "rate_limits",
      timestamps: false,
    }
  );

  return RateLimit;
};
