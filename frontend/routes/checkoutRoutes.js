const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const validateUserToken = require("../middleware/validateUserToken");

// ✅ Show checkout page
router.get("/", validateUserToken, checkoutController.showCheckoutPage); 

// ✅ Handle checkout form submission
router.post("/", validateUserToken, checkoutController.processCheckout); 

module.exports = router;
