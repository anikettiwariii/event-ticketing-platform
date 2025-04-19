// auth-service/controllers/userController.js
const userService = require('../services/userService');

// ✅ User Signup
exports.signupUser = userService.signupUser;

// ✅ User Login
exports.loginUser = userService.loginUser;

// ✅ Validate Token (optional - useful for auth middleware)
exports.validateUserToken = userService.validateUserToken;
