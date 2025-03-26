// for authentification

const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// Main authentication middleware
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.cookies.refreshToken;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch {
      return res.status(401).json({ error: "Unauthorized: Invalid access token" });
    }
  }

  if (refreshToken) {
    try {
      const refreshPayload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const session = await prisma.session.findUnique({ where: { token: refreshToken } });

      if (!session || session.expiresAt < new Date()) {
        throw new Error("Invalid or expired refresh token");
      }

      const newToken = jwt.sign({ userId: refreshPayload.userId }, process.env.JWT_SECRET, { expiresIn: "3h" }); // token duration
      res.cookie("token", newToken, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 });

      req.user = jwt.verify(newToken, process.env.JWT_SECRET);
      return next();
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized: " + err.message });
    }
  }

  res.status(401).json({ error: "Unauthorized: No access or refresh token provided" });
};

module.exports = requireAuth;
