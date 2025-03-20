const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    eventDate: Date,
    location: String
});

module.exports = mongoose.model('Ticket', ticketSchema);
