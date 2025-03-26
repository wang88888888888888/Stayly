// This file contains the CRUD operations for addresses.

// addressController.js
// Finds an existing address or creates a new one

// addressController.js
const { PrismaClient } = require("@prisma/client");
const { geocodeAddress } = require("../utils/geocode");

const prisma = new PrismaClient();

/**
 * Find or create an address based on the provided address string.
 */
exports.findOrCreateAddress = async (address) => {
  // Check if the address already exists in the database
  const existingAddress = await prisma.address.findUnique({
    where: { address },
  });

  if (existingAddress) {
    return existingAddress; // Return the existing address if found
  }

  // If the address does not exist, geocode it
  const location = await geocodeAddress(address);

  if (!location) {
    throw new Error("Geocoding failed: Unable to locate the provided address.");
  }

  // Create the address in the database
  const newAddress = await prisma.address.create({
    data: {
      address,
      latitude: location.lat,
      longitude: location.lng,
    },
  });

  return newAddress; // Return the newly created address
};

/**
 * Get all addresses from the database.
 */
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany();
    res.json(addresses); // Return all addresses
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
};

/**
 * Get an address by its ID.
 */
exports.getAddressById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid address ID provided." });
  }

  try {
    const address = await prisma.address.findUnique({
      where: { id: parseInt(id) },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found." });
    }

    res.json(address); // Return the address
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
};


/**
 * Delete an address by its ID.
 */
exports.deleteAddress = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid address ID provided." });
  }

  try {
    const deletedAddress = await prisma.address.delete({
      where: { id: parseInt(id) },
    });

    res.json(deletedAddress); // Return the deleted address
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
};

exports.searchAddressByApproximation = async (req, res) => {
  const { query } = req.query;

  try {
      let results;
      if (query) {
          // Perform a case-insensitive, partial match search
          results = await prisma.address.findMany({
              where: {
                  address: {
                    contains: query.toLowerCase(), // Lowercase the query manually
                  },
              },
              include: { reviews: true }, // Include grouped reviews
          });
      } else {
          // Return all addresses if no query is provided
          results = await prisma.address.findMany({
              include: { reviews: true },
          });
      }

      res.json(results);
  } catch (error) {
      console.error("Error searching addresses:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};
