// graphql/resolvers/productResolvers.js

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

import Newsletter from "../models/Newsletter.js";

import { JSONResolver } from "graphql-scalars";

export const productResolvers = {
  // Register JSON scalar so GraphQL can return objects safely
  JSON: JSONResolver,

  Query: {
    // your original queries
    products: (_, args) => getProducts(args.limit, args.skip),
    product: (_, { id }) => getProductById(id),
    searchProducts: (_, { keyword }) => searchProducts(keyword),

    shopProducts: (_, { filter, limit, skip }) => {
      return getProductsShop(limit, skip, filter);
    },
    BrandProductsShop: (_, { brand, limit, skip, filter }) =>
      getBrandProductsShop(brand, limit, skip, filter),

    shopMeta: () => getShopMeta(),
  },

  Mutation: {
    addProduct: (_, { product }) => addNewProduct(product),
    updateProduct: (_, { id, product }) => updateProduct(id, product),
    deleteProduct: async (_, { id }) => {
      await deleteProduct(id);
      return "Product deleted successfully";
    },
    subscribeNewsletter: async (_, { email }) => {
      if (!email) {
        throw new Error("Email is required");
      }

      console.log("Subscription attempt for email:", email);

      const existing = await Newsletter.findOne({ email });

      console.log("Existing subscription check:", existing);

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
  },
};
