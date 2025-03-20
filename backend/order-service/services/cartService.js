const Order = require("../models/Order");

// 🛒 Add item to cart
exports.addToCart = async (userId, event) => {
    if (!event || !event.id || !event.name || !event.price) {
        throw new Error("Invalid event data");
    }

    let cart = await Order.findOne({ userId, status: "pending" });

    if (!cart) {
        cart = new Order({ userId, items: [], totalAmount: 0 });
    }

    const existingItem = cart.items.find(item => item.eventId === event.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({
            eventId: event.id,
            name: event.name,
            price: event.price,
            quantity: 1
        });
    }

    cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await cart.save();
    return cart;
};

// 🗑️ Remove item from cart
exports.removeFromCart = async (userId, eventId) => {
    const cart = await Order.findOne({ userId, status: "pending" });
    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter(item => item.eventId !== eventId);
    cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await cart.save();
    return cart;
};

// 🛍️ View cart
exports.getCart = async (userId) => {
    return await Order.findOne({ userId, status: "pending" }) || { items: [], totalAmount: 0 };
};

// ✅ Checkout
exports.checkout = async (userId) => {
    const cart = await Order.findOne({ userId, status: "pending" });
    if (!cart) throw new Error("No active cart");

    cart.status = "completed";
    await cart.save();
    return cart;
};
