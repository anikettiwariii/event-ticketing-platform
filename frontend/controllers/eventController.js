const axios = require('axios');

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
    // ✅ Retrieve token from session
    const token = req.session.token;

    // ✅ If no token, redirect to login
    if (!token) {
        console.log("❌ No token found in session. Redirecting to login.");
        return res.redirect("/");
    }

    try {
        console.log("🔍 Fetching events...");
        const response = await axios.get("http://localhost:5001/api/events/all", {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Events received:", response.data);

        res.render("events", { 
            concerts: response.data.concerts || [], 
            sports: response.data.sports || [] 
        });

    } catch (error) {
        // ✅ Handle Unauthorized Token (401)
        if (error.response && error.response.status === 401) {
            console.log("❌ Token expired or invalid. Logging out user.");
            req.session.destroy(); // Destroy session to force re-login
            return res.redirect("/");
        }

        console.error("❌ Error fetching events:", error.message);
        res.render("events", { concerts: [], sports: [] }); // Send empty array to prevent crash
    }
};


// 🔹 Fetch and display a single event's details
exports.showEventDetails = async (req, res) => {
    try {
        const eventId = req.params.id;
        const token = req.session.token;

        if (!eventId) {
            console.error("❌ Missing event ID in request.");
            return res.status(400).send("Bad Request: Missing event ID");
        }

        console.log(`🔍 Fetching event details for ID: ${eventId}`);

        const response = await axios.get(`http://localhost:5001/api/events/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const event = response.data;
        console.log("✅ Event details fetched successfully:", event);

        // ✅ Precompute event price: If available, use it; otherwise, set to 100
        const eventPrice =
            event.priceRanges && event.priceRanges.length > 0
                ? event.priceRanges[0].min
                : 100;

        res.render("eventDetails", { event, eventPrice, token });
    } catch (error) {
        console.error("❌ Error fetching event details:", error.message);
        res.status(500).send("Internal Server Error: Could not fetch event details.");
    }
};


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
