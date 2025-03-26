const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const {
  register,
  login,
  logout,
  refreshToken,
  profile,
  getUserById,
  deleteUser,
  getAllUsers,
} = require("../controllers/userController"); // Include logout and refreshToken

// Register a new user
router.post("/users/register", register);

// Login a user
router.post("/users/login", login);

// Logout a user
router.post("/users/logout", requireAuth, logout); // Logout route (protected)

// Refresh the access token
router.post("/users/refresh-token", refreshToken); // Refresh token route (does not require auth)

// Fetch the profile of the logged-in user (protected route)
router.get("/users/profile", requireAuth, profile);

// Get all users
router.get("/users", getAllUsers); 

// Get a specific user by ID
router.get("/users/:id", getUserById); 

// Delete a user by ID
router.delete("/users/:id", deleteUser);

module.exports = router;
