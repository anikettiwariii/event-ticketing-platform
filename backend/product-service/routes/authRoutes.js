const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// 🔹 Signup (Register a new user)
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username or password is missing
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash password and save user
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.json({ message: 'Signup successful! Please log in.' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// 🔹 Login (Session & JWT)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`🔍 Login Attempt: ${username} ${password}`);

        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_secret_key', // Use env variable for security
            { expiresIn: '1h' }
        );

        console.log("✅ Token Generated:", token);

        res.json({ message: 'Login successful!', token }); // ✅ Ensure token is sent in response
    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});



// 🔹 Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});



// ✅ Middleware to verify JWT stored in session
const verifyJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers
    console.log("🔍 Token Received for Verification:", token);

    if (!token) {
        return res.status(403).json({ error: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        console.log("✅ Token Decoded:", decoded);
        req.user = decoded; // Attach decoded user to request
        next();
    } catch (error) {
        console.error("❌ Token Verification Failed:", error);
        return res.status(401).json({ error: "Invalid token." });
    }
};


module.exports = { authRoutes: router, verifyJWT };
