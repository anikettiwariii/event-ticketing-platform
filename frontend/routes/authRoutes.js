
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 🔐 Login using client credentials
router.get('/login', authController.login);

// 🔄 Refresh the access token using the refresh token
router.get('/refresh', authController.refreshToken);

// 🚪 Logout the client session
router.get('/logout', authController.logout);

module.exports = router;
