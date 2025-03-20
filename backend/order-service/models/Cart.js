const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },  // Identifies the user
    items: [
        {
            eventId: { type: String, required: true },  // Ticket/Event ID
            name: { type: String, required: true },  // Event Name
            price: { type: Number, required: true },  // Ticket Price
            quantity: { type: Number, default: 1 },  // Number of tickets
        }
    ]
});

module.exports = mongoose.model("Cart", cartSchema);
