// frontend/controllers/userAuthController.js
const axios = require('axios');

// 🔐 USER SIGNUP
exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        const response = await axios.post("http://localhost:4000/api/users/signup", {
            username,
            password
        });

        console.log("✅ User registered:", response.data);
        res.redirect("/"); // Redirect to login page
    } catch (error) {
        console.error("❌ Signup error:", error.response?.data || error.message);
        res.send("Signup failed. Try again.");
    }
};

// 🔐 USER LOGIN
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const response = await axios.post("http://localhost:4000/api/users/login", {
            username,
            password
        });

        const token = response.data.token;
        if (!token) throw new Error("No token received");

        req.session.token = token;
        console.log("✅ User token stored in session:", token);

        res.redirect("/events");
    } catch (error) {
        console.error("❌ Login failed:", error.response?.data || error.message);
        res.send("Login failed. Try again.");
    }
};

// 🚪 USER LOGOUT
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("❌ Logout error:", err);
            return res.send("Logout failed.");
        }
        res.redirect("/");
    });
};
