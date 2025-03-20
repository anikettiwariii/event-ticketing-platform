const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController"); 
const verifyJWT = require("../middlewares/authMiddleware"); 

router.get("/", verifyJWT, cartController.getCart);
router.post("/add", verifyJWT, cartController.addToCart);
router.post("/remove", verifyJWT, cartController.removeFromCart);

module.exports = router;
