const express = require('express');
const router = express.Router();
const sportsController = require('../controllers/sportsController');
const verifyClientToken = require('../utils/verifyClientToken');

// Route to get sports events
router.get("/sports", verifyClientToken, sportsController.getSportsEvents);
router.get("/sports/:id", verifyClientToken, sportsController.getSportsEventById);
module.exports = router;
