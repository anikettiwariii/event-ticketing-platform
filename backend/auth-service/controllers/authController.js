// auth-service/controllers/authController.js
const authService = require('../services/authService');

exports.registerClient = authService.registerClient;
exports.generateTokens = authService.generateTokens;
exports.refreshAccessToken = authService.refreshAccessToken;
