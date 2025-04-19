const ticketmasterService = require("../services/ticketmasterService");

exports.getConcerts = async (req, res) => {
    try {
        const concerts = await ticketmasterService.fetchConcerts();
        res.json(concerts);
    } catch (error) {
        console.error("❌ Error in Controller:", error.message);
        res.status(500).json({ error: "Failed to fetch concerts" });
    }
};

// 🔹 Controller to fetch concert by ID
exports.getConcertById = async (req, res) => {
    const eventId = req.params.id;
    console.log("🎯 Fetching concert with ID:", eventId);

    try {
        const event = await ticketmasterService.fetchConcertById(eventId);
        if (!event) {
            console.log("❌ Event not found for ID:", eventId);
            return res.status(404).json({ error: "Event not found" });
        }

        res.json(event);
    } catch (error) {
        console.error("❌ Error in getConcertById:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
