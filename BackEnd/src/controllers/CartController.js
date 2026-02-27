import Cart from "../models/Cart.js";

// Get or Create Cart
export const getCart = async (userId) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    return cart;
  } catch (error) {
    throw new Error(`Failed to fetch cart: ${error.message}`);
  }
};

// Add Item to Cart
export const addToCart = async (
  userId,
  productId,
  productData,
  quantity = 1,
  size = null,
  color = null,
) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId && item.size === size,
    );

    if (existingItem) {
      // Increase quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        productName: productData.name,
        productImage: productData.image,
        price: productData.price,
        quantity,
        size,
        color,
      });
    }

    cart.lastModified = new Date();
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(`Failed to add to cart: ${error.message}`);
  }
};

// Merge entire cart (bulk upsert)
export const mergeCart = async (userId, items = []) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    for (const incoming of items) {
      const productId = incoming.productId?.toString
        ? incoming.productId.toString()
        : incoming.productId;
      const size = incoming.size || null;
      const quantity = Number(incoming.quantity) || 1;

      const existingItem = cart.items.find(
        (item) =>
          item.productId.toString() === productId &&
          (item.size || null) === size,
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          productId,
          productName: incoming.productName || incoming.name || "",
          productImage: incoming.productImage || incoming.image || "",
          price: incoming.price || 0,
          quantity,
          size,
          color: incoming.color || null,
        });
      }
    }

    cart.lastModified = new Date();
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(`Failed to merge cart: ${error.message}`);
  }
};

// Update Cart Item
export const updateCartItem = async (
  userId,
  productId,
  quantity,
  size = null,
) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId && item.size === size,
    );

    if (!item) {
      throw new Error("Item not found in cart");
    }

    if (quantity <= 0) {
      // Remove item
      cart.items = cart.items.filter(
        (item) =>
          !(item.productId.toString() === productId && item.size === size),
      );
    } else {
      item.quantity = quantity;
    }

    cart.lastModified = new Date();
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(`Failed to update cart: ${error.message}`);
  }
};

// Remove Item from Cart
export const removeFromCart = async (userId, productId, size = null) => {
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
      (item) =>
        !(item.productId.toString() === productId && item.size === size),
    );

    cart.lastModified = new Date();
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(`Failed to remove from cart: ${error.message}`);
  }
};

// Clear Cart
export const clearCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = [];
    cart.lastModified = new Date();
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(`Failed to clear cart: ${error.message}`);
  }
};

// Get Cart Summary
export const getCartSummary = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return {
        itemCount: 0,
        totalPrice: 0,
        items: [],
      };
    }

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      itemCount,
      totalPrice,
      items: cart.items,
    };
  } catch (error) {
    throw new Error(`Failed to get cart summary: ${error.message}`);
  }
};
