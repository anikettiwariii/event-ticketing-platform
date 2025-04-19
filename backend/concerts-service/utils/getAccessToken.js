// utils/getAccessToken.js
const axios = require("axios");

let cachedToken = null;
let tokenExpiry = null;

const getAccessToken = async () => {
    const now = Date.now();

    // ✅ Reuse token if still valid
    if (cachedToken && tokenExpiry && now < tokenExpiry) {
        return cachedToken;
    }

    try {
        const response = await axios.post("http://localhost:4000/api/token", {
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            grant_type: "client_credentials"
        });

        cachedToken = response.data.accessToken;

        // ⏱️ Decode expiry time (in seconds) to milliseconds and cache it
        const expiresIn = 30 * 60 * 1000; // 30 minutes default
        tokenExpiry = now + expiresIn;

        return cachedToken;
    } catch (error) {
        console.error("❌ Error fetching access token:", error.response?.data || error.message);
        throw new Error("Failed to obtain access token");
    }
};

module.exports = getAccessToken;
