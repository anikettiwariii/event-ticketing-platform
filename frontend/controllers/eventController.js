const axios = require('axios');
const getAccessToken = require("../utils/getAccessToken");

exports.checkJWTAuth = (req, res, next) => {
    const token = req.session.token;

    if (!token) {
        console.log("❌ No token found in session. Redirecting to login.");
        return res.redirect("/");
    }
    console.log("✅ Found token:", token);
    next(); // Allow access if token exists
};

exports.showEvents = async (req, res) => {
    try {
        // 🔐 Get tokens for concert and sports services
        const concertToken = await getAccessToken("concert-service");
        const sportsToken = await getAccessToken("sports-service");

        // 🎶 Fetch concerts
        const concertResponse = await axios.get("http://localhost:5002/api/concerts", {
            headers: { Authorization: `Bearer ${concertToken}` },
        });

        // 🏀 Fetch sports
        const sportsResponse = await axios.get("http://localhost:5003/api/sports", {
            headers: { Authorization: `Bearer ${sportsToken}` },
        });

        res.render("events", {
            concerts: concertResponse.data || [],
            sports: sportsResponse.data || [],
        });

    } catch (error) {
        console.error("❌ Error fetching events:", error.message);
        res.render("events", { concerts: [], sports: [] });
    }
};


exports.showEventDetails = async (req, res) => {
    const eventId = req.params.id;
    if (!eventId) {
        console.error("❌ Missing event ID in request.");
        return res.status(400).send("Bad Request: Missing event ID");
    }

    try {
        // 🧠 Decide which service to use based on eventId pattern
        const isConcert = eventId.startsWith("Z") || eventId.includes("loom"); // basic heuristic
        const service = isConcert ? "concert-service" : "sports-service";
        const port = isConcert ? 5002 : 5003;

        const token = await getAccessToken(service);

        const response = await axios.get(`http://localhost:${port}/api/${isConcert ? "concerts" : "sports"}/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const event = response.data;
        const eventPrice =
            event.priceRanges && event.priceRanges.length > 0
                ? event.priceRanges[0].min
                : 100;

        res.render("eventDetails", { event, eventPrice, token: req.session.token });
    } catch (error) {
        console.error("❌ Error fetching event details:", error.message);
        res.status(500).send("Internal Server Error: Could not fetch event details.");
    }
};


/*
// 🔹 Signup User
exports.signup = async (req, res) => {
    try {
        console.log("Signup request received:", req.body); // Log request data

        const { username, password } = req.body;
        if (!username || !password) {
            return res.send("Username and password are required");
        }

        await axios.post("http://localhost:5001/api/auth/signup", { username, password });
        res.redirect("/");
    } catch (error) {
        console.error("❌ Signup error:", error.response?.data || error.message);
        res.send("Signup failed. Try again.");
    }
};

// 🔹 Login User
exports.login = async (req, res) => {
    try {
        const response = await axios.post("http://localhost:5001/api/auth/login", req.body);

        const token = response.data.token;  // ✅ Ensure token is correctly retrieved
        if (!token) throw new Error("No token received");

        // ✅ Store token in session
        req.session.token = token;
        console.log("✅ Token stored in session:", req.session.token);

        res.redirect("/events"); // Redirect to events page after successful login
    } catch (error) {
        console.error("❌ Login Failed:", error.response?.data || error.message);
        res.status(401).send("Login failed. Try again.");
    }
};

*/

// 🔹 Logout User
exports.logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("❌ Logout failed:", err);
            return res.send("Logout failed. Try again.");
        }
        res.redirect("/"); // Redirect to home page
    });
};
