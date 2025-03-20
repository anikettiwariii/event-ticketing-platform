const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("🔵 Checking Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("🚨 No Authorization header or incorrect format");
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    console.log("🟡 Extracted Token:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Successfully Verified:", decoded);
        
        req.user = decoded; // Attach user data to request
        
        // 🔴 ADD THIS DEBUGGING LOG BEFORE PASSING TO NEXT MIDDLEWARE
        console.log("🔵 Proceeding to next middleware with user:", req.user);

        next(); // Proceed to addToCart
    } catch (error) {
        console.error("❌ Token Verification Failed:", error.message);
        return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
};

module.exports = verifyJWT;
