const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mySqlDbConnect");
const User = require("./userModel");

const Otp = sequelize.define(
  "Otp",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "otps",
    timestamps: true,
    indexes: [
      {
        fields: ["expiresAt"],
      },
    ],
  }
);

module.exports = Otp;
