const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');

// 🔐 User Signup Route
router.post('/signup', userAuthController.signup);

// 🔐 User Login Route
router.post('/login', userAuthController.login);

// 🚪 User Logout Route
router.get('/logout', userAuthController.logout);

module.exports = router;
