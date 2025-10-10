const express = require("express");
const router = express.Router();
const { generateToken } = require("../utils/jwt");
const { Sequelize } = require("sequelize");
const validateRequest = require("../middlewares/validateRequest");
const { signupSchema } = require("../validator/authValidator");
const User = require("../model/userModel");

router.post("/signup", signupSchema, validateRequest, async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Check if email or username exists
    const existingUser = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or Username already exists" });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    // Generate JWT
    const token = generateToken({ id: newUser.id });

    res.status(200).json({
      message: "User registered successfully in MySQL",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    console.error("Error saving user:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});
module.exports = router;