const axios = require("axios");
require("dotenv").config();
module.exports = async function getAccessToken(serviceName) {
    const credentials = {
        "concert-service": {
            clientId: process.env.CONCERT_CLIENT_ID,
            clientSecret: process.env.CONCERT_CLIENT_SECRET,
        },
        "sports-service": {
            clientId: process.env.SPORTS_CLIENT_ID,
            clientSecret: process.env.SPORTS_CLIENT_SECRET,
        },
    };

    const creds = credentials[serviceName];
    if (!creds) throw new Error(`❌ Unknown service: ${serviceName}`);
    console.log(`🔑 Requesting token for ${serviceName} with:`, creds);


    try {
        const response = await axios.post("http://localhost:4000/api/token", {
            clientId: creds.clientId,
            clientSecret: creds.clientSecret,
            grant_type: "client_credentials",
        });

        return response.data.accessToken;
    } catch (error) {
        console.error(`❌ Error fetching access token for ${serviceName}:`, error.message);
        throw new Error("Failed to retrieve access token");
    }
};
