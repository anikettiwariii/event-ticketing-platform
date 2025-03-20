const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController"); // ✅ Import Checkout Controller
const verifyToken = require("../middlewares/authMiddleware"); // ✅ Ensure authentication

// 📌 **Checkout Route**
router.post("/", verifyToken, checkoutController.processCheckout); // ✅ Ensure function is correctly referenced

module.exports = router;
