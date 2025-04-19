const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    clientId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 } // Expires in 1 hr
});

module.exports = mongoose.model('Token', tokenSchema);
