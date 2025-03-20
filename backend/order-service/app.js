const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config(); // ✅ Load environment variables

const app = express();
app.use(express.json());

// ✅ Enable Sessions
app.use(session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.use(cors({ 
    origin: "http://localhost:3000", // ✅ Allow frontend
    credentials: true,
    methods: "GET,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Use Cart Routes
const cartRoutes = require("./routes/cartRoutes");
console.log("✅ Cart Routes Loaded");
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", require("./routes/checkoutRoutes"));

// ✅ Start Server on Port 5004
app.listen(5004, () => console.log("🛒 Order Service running on port 5004"));
