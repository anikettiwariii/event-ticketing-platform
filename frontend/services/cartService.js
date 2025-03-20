const API_URL = "http://localhost:5004/api/cart"; // Order service base URL

// ✅ Add to Cart
exports.addToCart = async (eventId, name, price, token) => {
    const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include JWT token
        },
        body: JSON.stringify({ eventId, name, price })
    });
    return response.json();
};

// ✅ Get Cart
exports.getCart = async (token) => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response.json();
};

// ✅ Remove from Cart
exports.removeFromCart = async (eventId, token) => {
    const response = await fetch(`${API_URL}/remove`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ eventId })
    });
    return response.json();
};
