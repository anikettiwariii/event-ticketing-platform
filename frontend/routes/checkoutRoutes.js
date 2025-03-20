const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");

router.get("/", checkoutController.showCheckoutPage); // ✅ Render checkout page
router.post("/", checkoutController.processCheckout); // ✅ Handle checkout logic

module.exports = router;
