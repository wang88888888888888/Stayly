const express = require("express");
const router = express.Router();
const { 
  searchAddressByApproximation, // Ensure no duplicates
  findOrCreateAddress,
  getAllAddresses,
  getAddressById,
  deleteAddress,
} = require("../controllers/addressController");

router.get("/addresses/search", searchAddressByApproximation);
router.post("/addresses", findOrCreateAddress);
router.get("/addresses", getAllAddresses);
router.get("/addresses/:id", getAddressById);
router.delete("/addresses/:id", deleteAddress);

module.exports = router;
