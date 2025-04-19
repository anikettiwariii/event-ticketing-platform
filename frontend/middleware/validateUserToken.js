// frontend/middleware/validateUserToken.js
const axios = require('axios');

module.exports = async function (req, res, next) {
    const token = req.session.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const response = await axios.get('http://localhost:4000/api/users/validate', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.valid) {
            req.userId = response.data.userId;
            next();
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error("❌ Token validation failed:", error.message);
        res.redirect('/login');
    }
};
