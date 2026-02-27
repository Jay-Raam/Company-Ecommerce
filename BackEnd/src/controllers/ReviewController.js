import Review from "../models/Review.js";

// Create Review
export const createReview = async (productId, userId, reviewData) => {
  try {
    const { rating, title, comment, images = [] } = reviewData;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }

    const review = await Review.create({
      productId,
      userId,
      rating,
      title,
      comment,
      images,
      status: "pending",
    });

    return review;
  } catch (error) {
    throw new Error(`Failed to create review: ${error.message}`);
  }
};

// Get Product Reviews
export const getProductReviews = async (
  productId,
  limit = 10,
  skip = 0,
  sortBy = "recent",
) => {
  try {
    let sortOption = { createdAt: -1 };
    if (sortBy === "rating-high") sortOption = { rating: -1 };
    if (sortBy === "rating-low") sortOption = { rating: 1 };
    if (sortBy === "helpful") sortOption = { helpful: -1 };

    const reviews = await Review.find({ productId, status: "approved" })
      .populate("userId", "name")
      .sort(sortOption)
      .limit(limit)
      .skip(skip);

    const total = await Review.countDocuments({
      productId,
      status: "approved",
    });

    const stats = await Review.aggregate([
      {
        $match: {
          productId: new (require("mongoose").Types.ObjectId)(productId),
          status: "approved",
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribut: {
            $push: {
              rating: "$rating",
            },
          },
        },
      },
    ]);

    return {
      reviews,
      total,
      stats: stats[0] || { avgRating: 0, totalReviews: 0 },
    };
  } catch (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }
};

// Get Review by ID
export const getReviewById = async (reviewId) => {
  try {
    const review = await Review.findById(reviewId).populate("userId", "name");
    if (!review) {
      throw new Error("Review not found");
    }
    return review;
  } catch (error) {
    throw new Error(`Failed to fetch review: ${error.message}`);
  }
};

// Update Review
export const updateReview = async (reviewId, userId, updates) => {
  try {
    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      throw new Error("Review not found");
    }

    const allowedUpdates = ["rating", "title", "comment", "images"];
    const filteredUpdates = {};

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      filteredUpdates,
      {
        new: true,
      },
    ).populate("userId", "name");

    return updatedReview;
  } catch (error) {
    throw new Error(`Failed to update review: ${error.message}`);
  }
};

// Delete Review
export const deleteReview = async (reviewId, userId) => {
  try {
    const review = await Review.findOneAndDelete({ _id: reviewId, userId });
    if (!review) {
      throw new Error("Review not found");
    }
    return "Review deleted successfully";
  } catch (error) {
    throw new Error(`Failed to delete review: ${error.message}`);
  }
};

// Mark Review as Helpful
export const markHelpful = async (reviewId) => {
  try {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true },
    );
    return review;
  } catch (error) {
    throw new Error(`Failed to mark review: ${error.message}`);
  }
};

// Mark Review as Unhelpful
export const markUnhelpful = async (reviewId) => {
  try {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { unhelpful: 1 } },
      { new: true },
    );
    return review;
  } catch (error) {
    throw new Error(`Failed to mark review: ${error.message}`);
  }
};

// Get Pending Reviews (Admin)
export const getPendingReviews = async (limit = 20, skip = 0) => {
  try {
    const reviews = await Review.find({ status: "pending" })
      .populate("productId", "name")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Review.countDocuments({ status: "pending" });

    return {
      reviews,
      total,
    };
  } catch (error) {
    throw new Error(`Failed to fetch pending reviews: ${error.message}`);
  }
};

// Approve Review (Admin)
export const approveReview = async (reviewId) => {
  try {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status: "approved" },
      { new: true },
    );
    if (!review) {
      throw new Error("Review not found");
    }
    return review;
  } catch (error) {
    throw new Error(`Failed to approve review: ${error.message}`);
  }
};

// Reject Review (Admin)
export const rejectReview = async (reviewId) => {
  try {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status: "rejected" },
      { new: true },
    );
    if (!review) {
      throw new Error("Review not found");
    }
    return review;
  } catch (error) {
    throw new Error(`Failed to reject review: ${error.message}`);
  }
};
