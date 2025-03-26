const express = require("express");
const router = express.Router();

/**
 * @route GET /ping
 * @description Test API responsiveness
 * @access Public
 */
router.get("/ping", (req, res) => {
  res.status(200).json({ message: "Pong!" });
});

module.exports = router;
