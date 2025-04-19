const axios = require("axios");
require("dotenv").config();

exports.fetchConcerts = async () => {
    try {
        const response = await axios.get("https://app.ticketmaster.com/discovery/v2/events.json", {
            params: {
                classificationName: "music", // 🎶 Fetch only concerts
                apikey: process.env.TICKETMASTER_API_KEY
            }
        });

        return response.data._embedded?.events || []; // ✅ Return concerts
    } catch (error) {
        console.error("❌ Ticketmaster API Error:", error.message);
        throw new Error("Failed to fetch concerts");
    }
};

// 🔹 Fetch concert by event ID
exports.fetchConcertById = async (eventId) => {
    try {
        const response = await axios.get(`https://app.ticketmaster.com/discovery/v2/events/${eventId}.json`, {
            params: {
                apikey: process.env.TICKETMASTER_API_KEY
            }
        });

        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching concert ID ${eventId}:`, error.message);
        throw new Error("Event not found");
    }
};