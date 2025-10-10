const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../config/dbConnect");

const User = sequelize.define(
  "User",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "First name is required" },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Last name is required" },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue("username", value.toLowerCase().trim());
      },
      validate: {
        notEmpty: { msg: "Username is required" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue("email", value.toLowerCase().trim());
      },
      validate: {
        isEmail: { msg: "Invalid email address" },
        notEmpty: { msg: "Email is required" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6],
          msg: "Password must be at least 6 characters long",
        },
      },
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

// ✅ Hash password before creating a new user
User.addHook("beforeCreate", async (user) => {
  const saltRounds = 10;
  user.password = await bcrypt.hash(user.password, saltRounds);
});

// ✅ Hash password if it changes during update
User.addHook("beforeUpdate", async (user) => {
  if (user.changed("password")) {
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
});

module.exports = User;
