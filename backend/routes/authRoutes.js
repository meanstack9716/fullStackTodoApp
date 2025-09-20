const express = require('express')
const nodemailer = require("nodemailer");
const router = express.Router();
const User = require('./../models/user');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { signupSchema, signinSchema } = require('../validator/authValidator');
const validateRequest = require('../middlewares/validateRequest');

// signUp 
router.post('/signup', signupSchema, validateRequest, async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (existingEmail || existingUsername) {
            return res.status(400).json({ error: 'Email or Username already exists' })
        }

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password
        });

        const savedUser = await newUser.save();

        const payload = { id: savedUser.id };
        const token = generateToken(payload);

        res.status(200).json({
            message: "user registered successfully",
            user: {
                id: savedUser.id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                username: savedUser.username,
                email: savedUser.email,
            },
            token,
        });
    } catch (err) {
        console.log('Error saving user', err)
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
})

//signIn
router.post('/signin', signinSchema, validateRequest, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'user not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

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
        console.log('Error login ', err)
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
})

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email not registered" });

        const otp = Math.floor(10000 + Math.random() * 90000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Todo App - OTP Code",
            text: `Hello,
We received a request to verify your account on Todo App.
Your OTP for Todo App is: ${otp}

⏳ It will expire in 10 minutes.  
⚠️ Do not share this code with anyone.

If you didn’t request this, please ignore this email.

- Todo App Team`

        });

        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email not registered" });

        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        if (user.otpExpires < new Date()) return res.status(400).json({ message: "OTP expired" });

        res.json({ message: "OTP verified successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email not registered" });

        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        if (user.otpExpires < new Date()) return res.status(400).json({ message: "OTP expired" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ message: "Password reset successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;