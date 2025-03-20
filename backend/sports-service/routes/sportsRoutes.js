const express = require('express');
const router = express.Router();
const sportsController = require('../controllers/sportsController');

// Route to get sports events
router.get('/', sportsController.getSportsEvents);

module.exports = router;
