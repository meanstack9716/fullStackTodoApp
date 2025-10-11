const express = require("express");
const router = express.Router();
const { generateToken } = require("../utils/jwt");
const { Sequelize } = require("sequelize");
const validateRequest = require("../middlewares/validateRequest");
const { signupSchema, signinSchema } = require("../validator/authValidator");
const User = require("../model/userModel");
const { sendEmail } = require("../utils/emailService");
const Otp = require("../model/otpModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//signUp
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

//signIn
router.post("/signin", signinSchema, validateRequest, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "User not found " });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    const token = generateToken({ id: user.id });
    res.status(200).json({
      message: "Login successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.log("Error login ", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

//send-otp
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const email = req.body.email.toLowerCase().trim();
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Email not registered" });
    const otp = crypto.randomInt(10000, 100000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await Otp.create({
      userId: user.id,
      otp: hashedOtp,
      expiresAt: otpExpires,
    });

    // const otpMessage = <h2></h2>
    await sendEmail(
      email,
      "Todo App - OTP Code",
      `<p>Hello,</p>
             <p>We received a request to verify your account on <strong>Todo App.</strong></p>
             <p>Your OTP for Todo App is: <strong>${otp}</strong><p>
             
             <p>⏳ It will expire in 10 minutes.</p>  
             <p>⚠️ Do not share this code with anyone.</p>
             
             <p>If you didn’t request this, please ignore this email.</p>
             
             <p>- Todo App Team</p>`
    );

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//verify-otp
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Email not registered" });

    const otpEntry = await Otp.findOne({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
    });
    if (!otpEntry) return res.status(400).json({ message: "Invalid OTP" });
    if (otpEntry.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, otpEntry.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//reset-password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Email not registered" });

    const otpEntry = await Otp.findOne({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
    });
    if (!otpEntry) return res.status(400).json({ message: "Invalid OTP" });

    if (otpEntry.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, otpEntry.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    user.password = newPassword;
    await user.save();

    await otpEntry.destroy();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
