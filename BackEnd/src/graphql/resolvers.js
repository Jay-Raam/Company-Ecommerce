// graphql/resolvers/productResolvers.js

import {
  getProducts,
  getProductById,
  searchProducts,
  addNewProduct,
  updateProduct,
  deleteProduct,
  getProductsShop,
  getShopMeta,
} from "../controllers/ProductController.js";

import { JSONResolver } from "graphql-scalars"; 

export const productResolvers = {
  // 👇 Register JSON scalar so GraphQL can return objects safely
  JSON: JSONResolver,

  Query: {
    // your original queries
    products: (_, args) => getProducts(args.limit, args.skip),
    product: (_, { id }) => getProductById(id),
    searchProducts: (_, { keyword }) => searchProducts(keyword),

    shopProducts: (_, { filter, limit, skip }) => {
      return getProductsShop(limit, skip, filter);
    },

    shopMeta: () => getShopMeta(),
  },

  Mutation: {
    addProduct: (_, { product }) => addNewProduct(product),
    updateProduct: (_, { id, product }) => updateProduct(id, product),
    deleteProduct: async (_, { id }) => {
      await deleteProduct(id);
      return "Product deleted successfully";
    },
  },
};
