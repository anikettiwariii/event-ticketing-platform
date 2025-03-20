const express = require('express');
const axios = require('axios');
require('dotenv').config();
const { verifyJWT } = require("../routes/authRoutes"); // ✅ Import JWT Middleware
const router = express.Router();
const API_KEY = process.env.TICKETMASTER_API_KEY;
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

// 🔹 Get all events from Ticketmaster
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&size=20`);
        if (response.data._embedded && response.data._embedded.events) {
            res.json(response.data._embedded.events);
        } else {
            res.json({ message: 'No events found' });
        }
    } catch (error) {
        console.error('Error fetching events:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

router.get('/all', verifyJWT, async (req, res) => {
    console.log("🔍 Fetching all events for user:", req.user.userId);

    try {
        // Call Concerts API
        console.log("🚀 Fetching concerts from Concert Service...");
        const concertsResponse = await axios.get('http://localhost:5002/api/concerts');
        console.log("✅ Concerts received:", concertsResponse.data.length);

        // Call Sports API
        console.log("🏀 Fetching sports from Sports Service...");
        const sportsResponse = await axios.get('http://localhost:5003/api/sports');
        console.log("✅ Sports received:", sportsResponse.data.length);

        res.json({ concerts: concertsResponse.data, sports: sportsResponse.data });
    } catch (error) {
        console.error("❌ Error fetching events:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});



// 🔹 Get events by city
router.get('/city', async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: 'City is required' });

    try {
        const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&city=${city}&size=10`);
        if (response.data._embedded && response.data._embedded.events) {
            res.json(response.data._embedded.events);
        } else {
            res.json({ message: `No events found in ${city}` });
        }
    } catch (error) {
        console.error(`Error fetching events for ${city}:`, error.response?.data || error.message);
        res.status(500).json({ error: `Failed to fetch events for ${city}` });
    }
});

// 🔹 Get event details by ID
router.get('/:id', async (req, res) => {
    const eventId = req.params.id;
    const API_KEY = process.env.TICKETMASTER_API_KEY; 

    try {
        console.log(`🔍 Fetching details for Event ID: ${eventId}`);

        const response = await axios.get(`https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=${API_KEY}`);

        if (response.data) {
            res.json(response.data);
        } else {
            res.status(404).json({ message: `No details found for event ID: ${eventId}` });
        }

    } catch (error) {
        console.error(`❌ Error fetching event details for ID ${eventId}:`, error.response?.data || error.message);
        res.status(500).json({ error: `Failed to fetch details for event ID ${eventId}` });
    }
});

module.exports = router;
