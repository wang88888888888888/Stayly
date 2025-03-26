// Define routes in the routes/ folder, each handling specific endpoints
// routes/reviewRoutes.js

const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth"); // Middleware to protect routes
const {
  getReviewsGroupedByAddress,
  getReviewsByAddress,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// Route for getting all reviews grouped by address
// This route does not require authentication because it fetches public data
router.get("/reviews/grouped-by-address", getReviewsGroupedByAddress);

// Route for getting reviews for a specific address
// This route does not require authentication as reviews are publicly visible
router.get("/reviews/:addressId", getReviewsByAddress);

// Protected routes for creating, updating, and deleting reviews
// These routes require authentication
router.post("/reviews", requireAuth, createReview); // Create a new review
router.put("/reviews/:id", requireAuth, updateReview); // Update a review
router.delete("/reviews/:id", requireAuth, deleteReview); // Delete a review

module.exports = router;


