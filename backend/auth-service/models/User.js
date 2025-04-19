const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String }, // hashed
    role: { type: String, enum: ["user", "admin"], default: "user" }
});

module.exports = mongoose.model("User", userSchema);
