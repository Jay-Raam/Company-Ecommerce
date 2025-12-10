import {
  getProducts,
  getProductById,
  getProductByProductId,
  searchProducts,
  addNewProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController.js";

export const productResolvers = {
  Query: {
    products: (_, args) => getProducts(args.limit, args.skip),
    product: (_, { id }) => getProductById(id),
    productByProductId: (_, { productId }) => getProductByProductId(productId),
    searchProducts: (_, { keyword }) => searchProducts(keyword),
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
