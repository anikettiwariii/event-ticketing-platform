const ticketmasterService = require('../services/ticketmasterService');

exports.getSportsEvents = async (req, res) => {
    try {
        console.log("🔍 Fetching sports events...");
        const events = await ticketmasterService.fetchSportsEvents();
        console.log("✅ Sports events received:", events);

        res.json(events);
    } catch (error) {
        console.error("❌ Error fetching sports events:", error.message);
        res.status(500).json({ error: "Failed to fetch sports events" });
    }
};
