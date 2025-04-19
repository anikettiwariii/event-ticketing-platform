// auth-service/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const Client = require('../models/Client');
const authController = require("../controllers/authController");

// 🔐 Step 1: Register Client (Machine A)
router.post("/register", authController.registerClient);

// 🔐 Step 5: Generate Access & Refresh Token using client credentials
router.post("/token", authController.generateTokens);

// 🔁 Step 6: Refresh Access Token
router.post("/token/refresh", authController.refreshAccessToken);

// Inside authRoutes.js (for debug only)
router.get('/clients', async (req, res) => {
    const clients = await Client.find();
    res.json(clients);
});

module.exports = router;
