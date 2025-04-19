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

exports.getSportsEventById = async (req, res) => {
    const eventId = req.params.id;
    console.log("🎯 Fetching sports event with ID:", eventId);

    try {
        const event = await ticketmasterService.fetchSportsEventById(eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });

        res.json(event);
    } catch (error) {
        console.error("❌ Error in getSportsEventById:", error.message);
        res.status(500).json({ error: "Failed to fetch sports event" });
    }
};

