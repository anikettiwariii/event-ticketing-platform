// frontend/controllers/authController.js
const axios = require('axios');

// 🔐 Step 1: Login (i.e., obtain tokens)
exports.login = async (req, res) => {
    const { clientId, clientSecret } = process.env;

    try {
        const response = await axios.post("http://localhost:4000/api/token", {
            clientId,
            clientSecret,
            grant_type: "client_credentials"
        });

        const { accessToken, refreshToken } = response.data;

        // 💾 Store in session
        req.session.token = accessToken;
        req.session.refreshToken = refreshToken;

        console.log("✅ Tokens saved in session.");
        res.redirect("/events");

    } catch (error) {
        console.error("❌ Login via Auth Service failed:", error.message);
        res.status(401).send("Login failed. Invalid client credentials.");
    }
};

// 🔄 Step 2: Refresh Token
exports.refreshToken = async (req, res) => {
    const refreshToken = req.session.refreshToken;

    if (!refreshToken) {
        return res.redirect("/");
    }

    try {
        const response = await axios.post("http://localhost:4000/api/token/refresh", {
            refreshToken
        });

        req.session.token = response.data.accessToken;
        console.log("🔄 Access token refreshed!");
        res.redirect("/events");

    } catch (error) {
        console.error("❌ Refresh token failed:", error.message);
        res.redirect("/");
    }
};

// 🚪 Logout
exports.logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("❌ Logout error:", err);
            return res.send("Logout failed");
        }
        res.redirect("/");
    });
};
