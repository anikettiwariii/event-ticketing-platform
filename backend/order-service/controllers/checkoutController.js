const Cart = require("../models/Cart"); // ✅ Import Cart Model
const Order = require("../models/Order"); // ✅ Import Order Model

exports.processCheckout = async (req, res) => {
    try {
        console.log("🛒 Checkout initiated for user:", req.user.userId);
        const userId = req.user.userId;

        // ✅ Fetch the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Cart is empty!" });
        }

        // ✅ Calculate total price from cart items
        const totalAmount = cart.items.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);

        // ✅ Create a new order
        const order = new Order({
            userId,
            items: cart.items,
            totalAmount, // ✅ Assign calculated totalAmount
            status: "Pending",
        });

        await order.save(); // ✅ Save Order to DB

        // ✅ Clear the user's cart after checkout
        await Cart.findOneAndDelete({ userId });

        console.log("✅ Order placed successfully:", order);
        res.json({ message: "Order placed successfully!", order });
    } catch (error) {
        console.error("❌ Checkout failed:", error.message);
        res.status(500).json({ error: "Checkout failed!" });
    }
};
