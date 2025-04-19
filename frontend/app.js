const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express(); // ✅ Initialize `app` first

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// ✅ Setup Sessions AFTER `app` initialization
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set `true` if using HTTPS
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Import and use routes
const eventRoutes = require('./routes/eventRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/', eventRoutes);
app.use('/users', userRoutes);
app.use("/checkout", require("./routes/checkoutRoutes"));
require("dotenv").config();
app.listen(3000, () => console.log('🌍 Frontend running on http://localhost:3000'));
