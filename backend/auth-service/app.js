const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const authRoutes = require('./routes/authRoutes'); // ✅ this one is correct
const userRoutes = require('./routes/userRoutes');

// Routes
app.use('/api', authRoutes); // ✅ mounts all endpoints at /api/register, /api/token, etc.
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Auth Service running on port ${PORT}`);
});
