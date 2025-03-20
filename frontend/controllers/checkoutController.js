const cartService = require("../services/cartService"); // ✅ Import cartService

exports.showCheckoutPage = async (req, res) => {
    try {
        const token = req.session.token;
        if (!token) {
            console.log("❌ No token found. Redirecting to login.");
            return res.redirect("/");
        }

        console.log("🚀 Fetching cart data for checkout...");
        const cart = await cartService.getCart(token);

        const items = cart.items || [];
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        console.log("✅ Checkout Data:", { items, total });

        res.render("checkout", { cart, total, token });

    } catch (error) {
        console.error("❌ Error loading checkout page:", error.message);
        res.render("checkout", { cart: { items: [] }, total: 0, token: req.session.token });
    }
};


exports.processCheckout = async (req, res) => {
    try {
        const token = req.session.token;
        if (!token) return res.redirect("/");

        const response = await fetch("http://localhost:5004/api/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Checkout failed!");

        res.redirect("/confirmation"); // Redirect to confirmation page
    } catch (error) {
        console.error("❌ Checkout error:", error.message);
        res.redirect("/cart");
    }
};
