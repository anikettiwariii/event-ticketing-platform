const express = require("express");
const router = express.Router();
const concertsController = require("../controllers/concertsController");

// ✅ Route to Fetch Concerts
router.get("/", concertsController.getConcerts);

module.exports = router;
