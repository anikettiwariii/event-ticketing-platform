const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const validateUserToken = require('../middleware/validateUserToken');

router.get('/', (req, res) => res.render('home'));
router.get('/events', validateUserToken, eventController.showEvents);
router.get('/events/:id', validateUserToken, eventController.showEventDetails);

module.exports = router;
