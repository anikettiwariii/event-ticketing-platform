const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    items: [
        {
            eventId: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, default: 1 },
        }
    ],
    totalAmount: { type: Number, required: true }, 
    status: { type: String, default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
