const express = require("express");
const router = express.Router();
const concertsController = require("../controllers/concertsController");
const verifyClientToken = require("../utils/verifyClientToken");

// Secure endpoint
router.get("/concerts", verifyClientToken, concertsController.getConcerts);
router.get("/concerts/:id", verifyClientToken, concertsController.getConcertById);

module.exports = router;
