const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mySqlDbConnect");
const User = require("./userModel");

const Todo = sequelize.define(
  "Todo",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("Extreme", "Moderate", "Low"),
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: null,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Completed", "Expired"),
      defaultValue: "Pending",
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
  },
  {
    tableName: "todos",
    timestamps: true,
    indexes: [
      {
        fields: ["expireAt"],
      },
    ],
  }
);

module.exports = Todo;
