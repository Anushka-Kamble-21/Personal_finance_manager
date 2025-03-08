const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
