const axios = require('axios');
require('dotenv').config();

exports.fetchSportsEvents = async () => {
    try {
        console.log("🚀 Calling Ticketmaster API for sports events...");

        const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
            params: {
                classificationName: 'sports',
                countryCode: 'CA', // 🇨🇦 Ensure correct country
                apikey: process.env.TICKETMASTER_API_KEY
            }
        });

        if (!response.data._embedded || !response.data._embedded.events) {
            console.warn("⚠️ No sports events found.");
            return [];
        }

        console.log("✅ Successfully fetched sports events");
        return response.data._embedded.events;
    } catch (error) {
        console.error("❌ Error calling Ticketmaster API:", error.message);
        throw new Error("Ticketmaster API request failed.");
    }
};
