// This file contains the CRUD operations for reviews.

const { PrismaClient } = require("@prisma/client");
const { findOrCreateAddress } = require("./addressController"); // Import address controller
const crypto = require("crypto");

const prisma = new PrismaClient();

/**
 * Creates a new review and associates it with an address and a user.
 * If the address does not exist, it will use the address controller to create it.
 */
exports.createReview = async (req, res) => {
  const { title, content, rating, address } = req.body; // userId comes from req.user

  if (!title || !content || !address) {
    return res.status(400).json({ error: "Missing required fields: title, content, or address" });
  }

  try {
    const userId = req.user.userId; // Extract logged-in user's ID from req.user
    const contentHash = crypto.createHash("sha256").update(content).digest("hex");

    // Find or create the address
    const addressEntry = await findOrCreateAddress(address);
    if (!addressEntry) {
      return res.status(500).json({ error: "Failed to process the address" });
    }

    // Check for duplicate review
    const existingReview = await prisma.review.findFirst({
      where: { userId, addressId: addressEntry.id, contentHash },
    });
    if (existingReview) {
      return res.status(409).json({ error: "Duplicate review detected for this address by the same user" });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
          title,
          content,
          contentHash,
          rating: parseInt(rating, 10) || 0,
          addressId: addressEntry.id,
          userId,
      },
      include: {
          address: true, // Ensure the associated address is fetched
      },
  });
  

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: `Failed to create review: ${error.message}` });
  }
};

/**
 * Retrieves all reviews for a specific address.
 */
exports.getReviewsByAddress = async (req, res) => {
  const { addressId } = req.params;

  if (!addressId || isNaN(addressId)) {
    return res.status(400).json({ error: "Invalid address ID" });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { addressId: parseInt(addressId) },
      include: { user: true, address: true },
    });

    if (reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for this address" });
    }

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: `Failed to retrieve reviews: ${error.message}` });
  }
};

/**
 * Retrieves reviews grouped by address.
 */
exports.getReviewsGroupedByAddress = async (req, res) => {
  try {
    const addressesWithReviews = await prisma.address.findMany({
      include: {
        reviews: {
          include: { user: { select: { id: true, email: true, name: true } } },
        },
      },
    });

    if (!addressesWithReviews.length) {
      return res.status(404).json({ error: "No addresses or reviews found" });
    }

    res.status(200).json(addressesWithReviews);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch reviews: ${error.message}` });
  }
};

/**
 * Updates an existing review by its ID.
 */
exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { title, content, rating } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid review ID" });
  }

  try {
    const existingReview = await prisma.review.findUnique({ where: { id: parseInt(id) } });
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (existingReview.userId !== req.user.userId) {
      return res.status(403).json({ error: "You are not authorized to update this review" });
    }

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: { title, content, rating },
    });

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: `Failed to update review: ${error.message}` });
  }
};


/**
 * Deletes a review by its ID.
 */
exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid review ID" });
  }

  try {
    const existingReview = await prisma.review.findUnique({ where: { id: parseInt(id) } });
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (existingReview.userId !== req.user.userId) {
      return res.status(403).json({ error: "You are not authorized to delete this review" });
    }

    const deletedReview = await prisma.review.delete({ where: { id: parseInt(id) } });

    res.json(deletedReview);
  } catch (error) {
    res.status(500).json({ error: `Failed to delete review: ${error.message}` });
  }
};
