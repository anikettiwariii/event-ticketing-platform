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

exports.fetchSportsEventById = async (eventId) => {
    try {
        console.log(`🔍 Fetching sport event by ID: ${eventId}`);

        const response = await axios.get(`https://app.ticketmaster.com/discovery/v2/events/${eventId}`, {
            params: {
                apikey: process.env.TICKETMASTER_API_KEY
            }
        });

        if (!response.data) {
            console.warn("⚠️ Event not found for ID:", eventId);
            return null;
        }

        console.log("✅ Successfully fetched sport event");
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching event by ID (${eventId}):`, error.message);
        throw new Error("Ticketmaster event fetch failed.");
    }
};