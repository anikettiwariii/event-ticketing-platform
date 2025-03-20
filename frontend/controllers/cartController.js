const cartService = require("../services/cartService");

exports.getCart = async (req, res) => {
    try {
        const token = req.session.token; // ✅ Retrieve token from session
        if (!token) {
            console.log("❌ No token found. Redirecting to login.");
            return res.redirect("/");
        }

        // ✅ Fetch the cart from order-service using the token
        const cart = await cartService.getCart(token);

        // ✅ Ensure cart always has items (avoid undefined error)
        res.render("cart", { cart: cart || { items: [] } });
    } catch (error) {
        console.error("❌ Error fetching cart:", error.message);
        res.render("cart", { cart: { items: [] } }); // ✅ Render with empty cart
    }
};

// ✅ Controller for adding an item to the cart
exports.addToCart = async (req, res) => {
    try {
        const token = req.session.token;
        if (!token) return res.redirect("/");

        const { eventId, name, price } = req.body;
        await cartService.addToCart(eventId, name, price, token);
        res.redirect("/cart"); // ✅ Redirect to cart after adding
    } catch (error) {
        console.error("❌ Error adding to cart:", error.message);
        res.status(500).json({ error: "Failed to add item to cart" });
    }
};

// ✅ Controller for removing an item from the cart
exports.removeFromCart = async (req, res) => {
    try {
        const token = req.session.token;
        if (!token) return res.redirect("/");

        const { eventId } = req.body;
        await cartService.removeFromCart(eventId, token);
        res.redirect("/cart"); // ✅ Redirect to cart after removing
    } catch (error) {
        console.error("❌ Error removing from cart:", error.message);
        res.status(500).json({ error: "Failed to remove item from cart" });
    }
};
