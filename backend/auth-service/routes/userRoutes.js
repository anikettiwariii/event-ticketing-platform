const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 🔹 Correct function names based on your controller exports
router.post('/signup', userController.signupUser);
router.post('/login', userController.loginUser);
router.get('/validate', userController.validateUserToken);

module.exports = router;
