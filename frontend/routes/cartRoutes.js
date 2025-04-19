const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const validateUserToken = require("../middleware/validateUserToken");

// ✅ View cart
router.get("/", validateUserToken, cartController.getCart);

// ✅ Add to cart
router.post("/add", validateUserToken, cartController.addToCart);

// ✅ Remove from cart
router.post("/remove", validateUserToken, cartController.removeFromCart);

module.exports = router;
