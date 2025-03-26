//userController.js
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

/**
 * Register a new user.
 */
exports.register = async (req, res) => {
  const { email, name, password } = req.body;

  // Validate input
  if (!email || !name || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      //console.log("Registration failed: User already exists", email);
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //console.log("Original password:", password);
    //console.log("Stored password (hashed):", hashedPassword);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    //console.log("Registration successful for user:", email);

    // Send the success response
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration failed:", error.message);
    res.status(500).json({ error: "Registration failed: " + error.message });
  }
};

/**
 * Login a user and generate tokens.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  //console.log("Login attempt for email:", email);

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    //console.log("User fetched from DB:", user);

    if (!user) {
      //console.log("User not found in database:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    //console.log("Password stored in DB:", user.password);
    //console.log("Password match result:", isPasswordValid);

    if (!isPasswordValid) {
      //console.log("Password mismatch for user:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate tokens
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3h" }); // Access token expires in 3 hours
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" }); // Refresh token expires in 14 days

    // Save the refresh token to the database
    await prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    //console.log("Login successful for user:", email);

    // Send cookies with the tokens
    res.cookie("token", token, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 }); // 3 hours
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({ id: user.id, email: user.email, name: user.name, token });
  } catch (error) {
    console.error("Login failed:", error.message);
    res.status(500).json({ error: "Login failed: " + error.message });
  }
};

/**
 * Logout a user and clear their session.
 */
exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required to log out." });
  }

  try {
    await prisma.session.deleteMany({ where: { token: refreshToken } });
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Error during logout:", error.message);
    res.status(500).json({ error: "Logout failed." });
  }
};

/**
 * Refresh the access token.
 */
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized: No refresh token provided." });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const session = await prisma.session.findUnique({ where: { token: refreshToken } });
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: "Refresh token expired or invalid." });
    }

    const newToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: "3h" }); //// Extend access token expiration to 3 hours
    res.cookie("token", newToken, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 });

    res.json({ message: "Token refreshed successfully.", token: newToken });
  } catch (err) {
    console.error("Error during token refresh:", err.message);
    res.status(401).json({ error: "Unauthorized." });
  }
};

/**
 * Get the profile of the logged-in user.
 */
exports.profile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        reviews: {
          include: { address: true },
        },
      },
    });


    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
};

/**
 * Get a user by ID.
 */
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
      include: { reviews: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    res.status(500).json({ error: "Failed to fetch user." });
  }
};

/**
 * Delete a user by ID.
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.delete({ where: { id: parseInt(id, 10) } });
    res.json({ message: "User deleted successfully.", user });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Failed to delete user." });
  }
};

/**
 * Get all users.
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ include: { reviews: true } });
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error.message);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};
