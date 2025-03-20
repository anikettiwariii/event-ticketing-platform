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
