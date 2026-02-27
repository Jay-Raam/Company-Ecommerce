import { sendWelcomeEmail, sendOfferEmail } from "../../util/sendMail.js";
import {
  getProducts,
  getProductById,
  searchProducts,
  addNewProduct,
  updateProduct,
  deleteProduct,
  getProductsShop,
  getShopMeta,
  getBrandProductsShop,
} from "../controllers/ProductController.js";

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getUserProfile,
  updateUserProfile,
  verifyAccessToken,
  verifyRefreshToken,
  changePassword,
  logoutUser,
  deleteUserAccount,
} from "../controllers/UserController.js";

import {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddressByType,
} from "../controllers/AddressController.js";

import {
  getCart,
  addToCart,
  mergeCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary,
} from "../controllers/CartController.js";

import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  trackOrder,
  getAllOrders,
  getOrderStats,
} from "../controllers/OrderController.js";

import {
  createReview,
  getProductReviews,
  getReviewById,
  updateReview,
  deleteReview,
  markHelpful,
  markUnhelpful,
  getPendingReviews,
  approveReview,
  rejectReview,
} from "../controllers/ReviewController.js";

import {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist,
  getWishlistCount,
  moveToCart,
} from "../controllers/WishlistController.js";

import Newsletter from "../models/Newsletter.js";
import { JSONResolver } from "graphql-scalars";

export const productResolvers = {
  JSON: JSONResolver,

  Query: {
    /* ============ PRODUCTS ============ */
    products: (_, args) => getProducts(args.limit, args.skip),
    product: (_, { id }) => getProductById(id),
    searchProducts: (_, { keyword }) => searchProducts(keyword),
    shopProducts: (_, { filter, limit, skip }) =>
      getProductsShop(limit, skip, filter),
    BrandProductsShop: (_, { brand, limit, skip, filter }) =>
      getBrandProductsShop(brand, limit, skip, filter),
    shopMeta: () => getShopMeta(),

    /* ============ USER ============ */
    userProfile: (_, { token }) => {
      const decoded = verifyAccessToken(token);
      return getUserProfile(decoded.userId);
    },
    me: async (_, __, { request }) => {
      try {
        console.log("🔍 Me resolver called");
        console.log("📦 Headers:", request.headers);

        const authHeader = request.headers.authorization;
        console.log("🔐 Auth header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          console.log("⚠️ No valid Bearer token in headers");
          console.log("📍 Raw cookies:", request.headers.cookie);
          return null;
        }

        const token = authHeader.slice(7); // Remove 'Bearer ' prefix
        console.log("🎫 Token found, verifying...");

        const decoded = verifyAccessToken(token);
        console.log("✅ Token verified, userId:", decoded.userId);

        const user = await getUserProfile(decoded.userId);
        console.log("👤 User fetched:", user);
        return user;
      } catch (error) {
        console.error("❌ Error in me resolver:", error.message);
        console.error("📋 Error details:", error);
        return null;
      }
    },

    /* ============ ADDRESSES ============ */
    userAddresses: (_, { userId }) => getUserAddresses(userId),
    userAddress: (_, { addressId, userId }) =>
      getAddressById(addressId, userId),
    defaultAddressByType: (_, { userId, type }) =>
      getDefaultAddressByType(userId, type),

    /* ============ CART ============ */
    cart: (_, { userId }) => getCart(userId),
    cartSummary: (_, { userId }) => getCartSummary(userId),

    /* ============ ORDERS ============ */
    userOrders: (_, { userId, limit, skip }) =>
      getUserOrders(userId, limit, skip),
    order: (_, { orderId, userId }) => getOrderById(orderId, userId),
    trackOrder: (_, { orderId, userId }) => trackOrder(orderId, userId),
    allOrders: (_, { limit, skip, filter }) =>
      getAllOrders(limit, skip, filter),
    orderStats: () => getOrderStats(),

    /* ============ REVIEWS ============ */
    productReviews: (_, { productId, limit, skip, sortBy }) =>
      getProductReviews(productId, limit, skip, sortBy),
    review: (_, { reviewId }) => getReviewById(reviewId),
    pendingReviews: (_, { limit, skip }) => getPendingReviews(limit, skip),

    /* ============ WISHLIST ============ */
    userWishlist: (_, { userId }) => getUserWishlist(userId),
    wishlistCount: (_, { userId }) => getWishlistCount(userId),
    isInWishlist: (_, { userId, productId }) => isInWishlist(userId, productId),
  },

  Mutation: {
    /* ============ PRODUCTS ============ */
    addProduct: (_, { product }) => addNewProduct(product),
    updateProduct: (_, { id, product }) => updateProduct(id, product),
    deleteProduct: async (_, { id }) => {
      await deleteProduct(id);
      return "Product deleted successfully";
    },

    /* ============ NEWSLETTER ============ */
    subscribeNewsletter: async (_, { email }) => {
      if (!email) {
        throw new Error("Email is required");
      }

      console.log("Subscription attempt for email:", email);
      const existing = await Newsletter.findOne({ email });

      if (existing) {
        sendOfferEmail(email)
          .then(() => console.log("Offer email sent successfully to:", email))
          .catch((err) => console.error("Offer email failed:", err));
        return "You are already subscribed. Check your email for an exclusive offer!";
      }

      await Newsletter.create({ email });

      sendWelcomeEmail(email)
        .then(() => console.log("Welcome email sent successfully to:", email))
        .catch((err) => console.error("Email failed:", err));

      return "Successfully subscribed!";
    },

    /* ============ USER AUTHENTICATION ============ */
    registerUser: async (
      _,
      { name, email, password, phone },
      { res, request },
    ) => {
      try {
        const result = await registerUser(name, email, password, phone);
        console.log("✅ registerUser result:", {
          id: result?.id,
          name: result?.name,
          email: result?.email,
          hasAccessToken: !!result?.accessToken,
          hasRefreshToken: !!result?.refreshToken,
        });

        // Set httpOnly cookies directly in resolver (match loginUser behavior)
        if (result?.accessToken && result?.refreshToken) {
          const cookieOptions = {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            domain: "localhost",
            maxAge: 15 * 60 * 1000, // 15 minutes
          };

          console.log(
            "🍪 [SETTING COOKIES IN RESOLVER] for:",
            email,
            "Options:",
            JSON.stringify(cookieOptions),
          );

          // Set access token cookie
          res.cookie("accessToken", result.accessToken, cookieOptions);
          console.log("✅ accessToken cookie set");

          // Set refresh token with longer expiry
          res.cookie("refreshToken", result.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
          console.log("✅ refreshToken cookie set (7 days)");

          // Return user WITHOUT tokens (they're in cookies now)
          const { accessToken, refreshToken, ...userWithoutTokens } = result;
          console.log("🔒 Returning user WITHOUT tokens");
          return userWithoutTokens;
        }

        throw new Error(
          "Missing accessToken or refreshToken in registration response",
        );
      } catch (error) {
        console.error("❌ Register error:", error.message);
        throw error;
      }
    },

    loginUser: async (_, { email, password }, { res }) => {
      try {
        console.log("🔐 GraphQL loginUser called with:", { email });
        const result = await loginUser(email, password);
        console.log("✅ loginUser result:", {
          id: result?.id,
          name: result?.name,
          email: result?.email,
          hasAccessToken: !!result?.accessToken,
          hasRefreshToken: !!result?.refreshToken,
        });

        // Set httpOnly cookies directly in resolver
        if (result?.accessToken && result?.refreshToken) {
          const cookieOptions = {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            domain: "localhost",
            maxAge: 15 * 60 * 1000,
          };

          console.log(
            "🍪 [SETTING COOKIES IN RESOLVER] for:",
            email,
            "Options:",
            JSON.stringify(cookieOptions),
          );

          // Set access token cookie using Express res.cookie()
          res.cookie("accessToken", result.accessToken, cookieOptions);
          console.log("✅ accessToken cookie set");

          // Set refresh token with longer expiry
          res.cookie("refreshToken", result.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          console.log("✅ refreshToken cookie set (7 days)");

          // Return user WITHOUT tokens (they're in cookies now)
          const { accessToken, refreshToken, ...userWithoutTokens } = result;
          console.log("🔒 Returning user WITHOUT tokens");
          return userWithoutTokens;
        }

        throw new Error(
          "Missing accessToken or refreshToken in login response",
        );
      } catch (error) {
        console.error("❌ Login error in resolver:", {
          message: error?.message,
          stack: error?.stack,
          code: error?.code,
        });
        throw error;
      }
    },

    logout: async (_, __, { res, request }) => {
      try {
        console.log("🚪 Logout called");
        // Invalidate refresh token if needed
        const authHeader = request.headers.authorization;
        if (authHeader) {
          const token = authHeader.slice(7);
          try {
            const decoded = verifyAccessToken(token);
            await logoutUser(decoded.userId);
          } catch (e) {
            console.log("Token already invalid");
          }
        }
        // Clear cookies with domain to ensure they're removed
        res.clearCookie("accessToken", { path: "/", domain: "localhost" });
        res.clearCookie("refreshToken", { path: "/", domain: "localhost" });
        console.log("✅ Cookies cleared");
        return "Successfully logged out";
      } catch (error) {
        console.error("❌ Logout error:", error.message);
        throw error;
      }
    },
    refreshAccessToken: async (_, __, { request, res }) => {
      try {
        console.log("🔄 Refresh token mutation called");

        // Get refresh token from cookie
        const refreshToken = request.cookies?.refreshToken;
        console.log(
          "🍪 Refresh token from cookie:",
          refreshToken ? "✅ Found" : "❌ Missing",
        );

        if (!refreshToken) {
          throw new Error(
            "No refresh token found in cookies. Please login again.",
          );
        }

        // Call controller to refresh
        const result = await refreshAccessToken(refreshToken);
        console.log("✅ New access token generated");

        // Set new access token cookie
        const cookieOptions = {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/",
          domain: "localhost",
          maxAge: 15 * 60 * 1000, // 15 minutes
        };

        res.cookie("accessToken", result.accessToken, cookieOptions);
        console.log("🍪 New accessToken cookie set");

        return {
          success: true,
          message: "Token refreshed successfully",
        };
      } catch (error) {
        console.error("❌ Refresh token error:", error.message);
        throw error;
      }
    },

    updateUserProfile: async (_, { userId, updates }) => {
      try {
        return await updateUserProfile(userId, updates);
      } catch (error) {
        console.error("Update profile error:", error.message);
        throw error;
      }
    },

    changePassword: async (_, { userId, oldPassword, newPassword }) => {
      try {
        return await changePassword(userId, oldPassword, newPassword);
      } catch (error) {
        console.error("Change password error:", error.message);
        throw error;
      }
    },

    deleteUserAccount: async (_, { userId }) => {
      try {
        return await deleteUserAccount(userId);
      } catch (error) {
        console.error("Delete account error:", error.message);
        throw error;
      }
    },

    /* ============ ADDRESSES ============ */
    createAddress: (_, { userId, addressData }) =>
      createAddress(userId, addressData),
    updateAddress: (_, { addressId, userId, updates }) =>
      updateAddress(addressId, userId, updates),
    deleteAddress: (_, { addressId, userId }) =>
      deleteAddress(addressId, userId),
    setDefaultAddress: (_, { addressId, userId }) =>
      setDefaultAddress(addressId, userId),

    /* ============ CART ============ */
    addToCart: (_, { userId, productId, productData, quantity, size, color }) =>
      addToCart(userId, productId, productData, quantity, size, color),
    mergeCart: (_, { userId, items }) => mergeCart(userId, items),
    updateCartItem: (_, { userId, productId, quantity, size }) =>
      updateCartItem(userId, productId, quantity, size),
    removeFromCart: (_, { userId, productId, size }) =>
      removeFromCart(userId, productId, size),
    clearCart: (_, { userId }) => clearCart(userId),

    /* ============ ORDERS ============ */
    createOrder: (_, { userId, orderData }) => createOrder(userId, orderData),
    updateOrderStatus: (_, { orderId, status, notes }) =>
      updateOrderStatus(orderId, status, notes),
    cancelOrder: (_, { orderId, userId, reason }) =>
      cancelOrder(orderId, userId, reason),

    /* ============ REVIEWS ============ */
    createReview: (_, { productId, userId, reviewData }) =>
      createReview(productId, userId, reviewData),
    updateReview: (_, { reviewId, userId, updates }) =>
      updateReview(reviewId, userId, updates),
    deleteReview: (_, { reviewId, userId }) => deleteReview(reviewId, userId),
    markReviewHelpful: (_, { reviewId }) => markHelpful(reviewId),
    markReviewUnhelpful: (_, { reviewId }) => markUnhelpful(reviewId),
    approveReview: (_, { reviewId }) => approveReview(reviewId),
    rejectReview: (_, { reviewId }) => rejectReview(reviewId),

    /* ============ WISHLIST ============ */
    addToWishlist: (_, { userId, productId, productData }) =>
      addToWishlist(userId, productId, productData),
    removeFromWishlist: (_, { userId, productId }) =>
      removeFromWishlist(userId, productId),
    clearWishlist: (_, { userId }) => clearWishlist(userId),
    moveWishlistToCart: (_, { userId, productIds }) =>
      moveToCart(userId, productIds),
  },
};
