const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// ✅ View cart
router.get("/", cartController.getCart);

// ✅ Add to cart
router.post("/add", cartController.addToCart);

// ✅ Remove from cart
router.post("/remove", cartController.removeFromCart);

module.exports = router;
