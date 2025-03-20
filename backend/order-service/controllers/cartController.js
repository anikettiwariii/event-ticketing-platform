const Cart = require("../models/Cart");

// 📌 Get Cart for the Logged-in User
const getCart = async (req, res) => {
    try {
        const userId = req.user?.userId;
        console.log("🛒 Fetching cart for user:", userId);

        const cart = await Cart.findOne({ userId });
        
        if (!cart || cart.items.length === 0) {
            console.log("⚠️ No cart found for user:", userId);
            return res.json({ message: "Cart is empty", items: [] });
        }

        console.log("✅ Cart retrieved successfully:", cart);
        res.json({ message: "Cart retrieved successfully!", items: cart.items });
    } catch (error) {
        console.error("❌ Error fetching cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// 📌 Add Item to Cart
const addToCart = async (req, res) => {
    try {
        console.log("🛒 Received add to cart request:", req.body);
        
        const userId = req.user?.userId;  // ✅ Extract from JWT
        if (!userId) {
            console.log("🚨 Unauthorized request: Missing userId in token!");
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { eventId, name, price } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        cart.items.push({ eventId, name, price });
        await cart.save();

        console.log("✅ Updated Cart:", cart);
        res.json(cart);
    } catch (error) {
        console.error("❌ Error adding to cart:", error.message);
        res.status(500).json({ error: "Failed to add item to cart" });
    }
};

// 📌 Remove Item from Cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId; // ✅ Extract from JWT, NOT session
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { eventId } = req.body;
        if (!eventId) return res.status(400).json({ error: "Event ID is required" });

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        // ✅ Filter out the event from the cart
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.eventId !== eventId);

        if (cart.items.length === initialLength) {
            return res.status(404).json({ error: "Event not found in cart" });
        }

        await cart.save();
        res.json({ message: "Item removed successfully", cart });
    } catch (error) {
        console.error("❌ Error removing from cart:", error.message);
        res.status(500).json({ error: "Failed to remove item from cart" });
    }
};


module.exports = {
    getCart,
    addToCart,
    removeFromCart
};