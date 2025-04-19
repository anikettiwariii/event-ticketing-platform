const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const concertRoutes = require("./routes/concertsRoutes"); // ✅ Ensure path is correct
app.use("/api", concertRoutes); 

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🎵 Concert Service running on port ${PORT}`));
