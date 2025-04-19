const jwt = require("jsonwebtoken");

const verifyClientToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Should match auth-service secret
        req.client = decoded; // optional: attach client info
        next();
    } catch (error) {
        console.error("❌ Invalid token:", error.message);
        return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
};

module.exports = verifyClientToken;
