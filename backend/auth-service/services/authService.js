// auth-service/services/authService.js
const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '30m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
const JWT_SECRET = process.env.JWT_SECRET;

// Step 1: Register client
exports.registerClient = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Client name is required' });

    const clientId = `client_${Date.now()}`;
    const clientSecret = Math.random().toString(36).substring(2, 15);
    const hashedSecret = await bcrypt.hash(clientSecret, 10);

    try {
        await Client.create({ clientId, clientSecret: hashedSecret, name });
        res.status(201).json({ clientId, clientSecret });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

// Step 5: Generate tokens
// Step 5: Generate tokens
exports.generateTokens = async (req, res) => {
    const { clientId, clientSecret, grant_type } = req.body;

    if (grant_type !== 'client_credentials') {
        return res.status(400).json({ error: 'Unsupported grant type' });
    }

    const client = await Client.findOne({ clientId });
    if (!client) return res.status(401).json({ error: 'Invalid client ID' });

    // 🧪 Log secrets for debugging
    console.log("🧪 Comparing secrets:");
    console.log("Provided:", clientSecret, `(${clientSecret.length})`);
    console.log("Stored  :", client.clientSecret, `(${client.clientSecret.length})`);

    // 🔍 Trim provided secret in case of accidental newline/space
    const isValid = await bcrypt.compare(clientSecret.trim(), client.clientSecret);
    if (!isValid) {
        console.log("❌ Secret match result: false");
        return res.status(401).json({ error: 'Invalid client secret' });
    }

    console.log("✅ Secret match result: true");

    const payload = { clientId };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '30m'
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'
    });

    res.json({ accessToken, refreshToken });
};


// Step 6: Refresh token
exports.refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        const newAccessToken = jwt.sign({ clientId: decoded.clientId }, JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN
        });
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('❌ Refresh token error:', error);
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
};
