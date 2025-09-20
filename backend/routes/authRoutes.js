const express = require('express')
const router = express.Router();
const User = require('./../models/user');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { signupSchema, signinSchema } = require('../validator/authValidator');
const validateRequest = require('../middlewares/validateRequest');

// signUp 
router.post('/signup', signupSchema, validateRequest, async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, confirmPassword } = req.body;

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

module.exports = router;