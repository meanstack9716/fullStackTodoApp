const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { generateToken } = require('../utils/jwt');
const { signupSchema, signinSchema } = require('../validator/authValidator');
const validateRequest = require('../middlewares/validateRequest');
const { sendEmail } = require('../utils/emailService');
const { Otp } = require('../models/otp');
const { User } = require('./../models/user');

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

        const otp = crypto.randomInt(10000, 100000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await Otp.create({ userId: user._id, otp: hashedOtp, expiresAt: otpExpires });

        await sendEmail(
            email,
            "Todo App - OTP Code",
            `Hello,
We received a request to verify your account on Todo App.
Your OTP for Todo App is: ${otp}

⏳ It will expire in 10 minutes.  
⚠️ Do not share this code with anyone.

If you didn’t request this, please ignore this email.

- Todo App Team`

        );

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

        const otpEntry = await Otp.findOne({ userId: user.id }).sort({ createdAt: -1 });
        if (!otpEntry) return res.status(400).json({ message: "Invalid OTP" });

        if (otpEntry.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

        const isMatch = await bcrypt.compare(otp, otpEntry.otp);
        if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

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

        const otpEntry = await Otp.findOne({ userId: user.id, }).sort({ createdAt: -1 });
        if (!otpEntry) return res.status(400).json({ message: "Invalid OTP" });

        if (otpEntry.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

        const isMatch = await bcrypt.compare(otp, otpEntry.otp);
        if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

        user.password = newPassword;
        await user.save();

        await Otp.deleteOne({ id: otpEntry.id });

        res.json({ message: "Password reset successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;