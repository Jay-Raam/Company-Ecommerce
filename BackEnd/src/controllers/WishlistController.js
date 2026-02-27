import Wishlist from "../models/Wishlist.js";

// Get User Wishlist
export const getUserWishlist = async (userId) => {
  try {
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, items: [] });
    }
    return wishlist;
  } catch (error) {
    throw new Error(`Failed to fetch wishlist: ${error.message}`);
  }
};

// Add to Wishlist
export const addToWishlist = async (userId, productId, productData) => {
  try {
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, items: [] });
    }

    // Check if product already in wishlist
    const exists = wishlist.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (exists) {
      throw new Error("Product already in wishlist");
    }

    wishlist.items.push({
      productId,
      productName: productData.name,
      productImage: productData.image,
      price: productData.price,
    });

    await wishlist.save();
    return wishlist;
  } catch (error) {
    throw new Error(`Failed to add to wishlist: ${error.message}`);
  }
};

// Remove from Wishlist
export const removeFromWishlist = async (userId, productId) => {
  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await wishlist.save();
    return wishlist;
  } catch (error) {
    throw new Error(`Failed to remove from wishlist: ${error.message}`);
  }
};

// Check if Product in Wishlist
export const isInWishlist = async (userId, productId) => {
  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return false;
    }

    return wishlist.items.some(
      (item) => item.productId.toString() === productId,
    );
  } catch (error) {
    throw new Error(`Failed to check wishlist: ${error.message}`);
  }
};

// Clear Wishlist
export const clearWishlist = async (userId) => {
  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    wishlist.items = [];
    await wishlist.save();
    return wishlist;
  } catch (error) {
    throw new Error(`Failed to clear wishlist: ${error.message}`);
  }
};

// Get Wishlist Count
export const getWishlistCount = async (userId) => {
  try {
    const wishlist = await Wishlist.findOne({ userId });
    return wishlist ? wishlist.items.length : 0;
  } catch (error) {
    throw new Error(`Failed to get wishlist count: ${error.message}`);
  }
};

// Move Wishlist Item to Cart (Bulk Add)
export const moveToCart = async (userId, productIds) => {
  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    // Filter items to move
    const itemsToMove = wishlist.items.filter((item) =>
      productIds.includes(item.productId.toString()),
    );

    // Remove from wishlist
    wishlist.items = wishlist.items.filter(
      (item) => !productIds.includes(item.productId.toString()),
    );

    await wishlist.save();

    return {
      movedItems: itemsToMove,
      wishlist,
    };
  } catch (error) {
    throw new Error(`Failed to move items: ${error.message}`);
  }
};
