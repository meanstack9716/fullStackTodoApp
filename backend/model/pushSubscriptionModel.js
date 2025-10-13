const DataTypes = require("sequelize");
const { sequelize } = require("../config/mySqlDbConnect");

const PushSubscription = sequelize.define(
  "PushSubscription",
  {
    fcmToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "pushsubscriptions",
    timestamps: false,
  }
);

module.exports = PushSubscription
