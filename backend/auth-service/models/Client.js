const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    clientId: { type: String, required: true, unique: true },
    clientSecret: { type: String, required: true },
    scopes: [String]
});

module.exports = mongoose.model("Client", clientSchema);
