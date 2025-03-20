require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const sportsRoutes = require('./routes/sportsRoutes');
app.use('/api/sports', sportsRoutes);

// Start the server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`🏀 Sports Service running on port ${PORT}`);
});
