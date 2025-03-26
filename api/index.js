//This file sets up the server and integrates the routes.

// Import required modules
// Import required modules
// index.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const reviewRoutes = require("./routes/reviewRoutes");
const addressRoutes = require("./routes/addressRoutes");
const userRoutes = require("./routes/userRoutes");
const pingRoutes = require("./routes/pingRoutes"); // Import pingRoutes


const app = express();

const PORT = process.env.PORT || 8000;

// Middleware configuration
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allow credentials (cookies)
app.use(express.json()); // Middleware to parse incoming JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies in the request

// Register Routes
app.use("/api", pingRoutes); // Add /ping under the /api prefix


// Route handlers
app.use("/api", reviewRoutes);
app.use("/api", addressRoutes);
app.use("/api", userRoutes);

// Export app for testing purposes
module.exports = app;

// Only start the server if this is not a test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}
