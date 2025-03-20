const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 🔹 Parses form data

// ✅ CORS Configuration (Allows frontend to communicate with backend)
app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend
    credentials: true // Allow sending session cookies
}));

// ✅ Enable Sessions (Instead of Cookies for JWT)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Import Routes
const { authRoutes, verifyJWT } = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/events', require('./routes/eventRoutes'));

// ✅ Protect event routes with JWT authentication
app.use('/api/protected-events', verifyJWT, require('./routes/eventRoutes'));

// ✅ Start Server
app.listen(5001, () => console.log('🎟️ Ticket Service running on port 5001'));
