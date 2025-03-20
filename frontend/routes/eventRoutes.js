const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', (req, res) => res.render('home'));
router.post('/signup', eventController.signup);
router.post('/login', eventController.login);
router.get('/logout', eventController.logout);
router.get('/events', eventController.checkJWTAuth, eventController.showEvents);
router.get('/events/:id', eventController.checkJWTAuth, eventController.showEventDetails);


module.exports = router;
