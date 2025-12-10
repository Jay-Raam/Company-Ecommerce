import { Product } from "../models/ProductModal.js";

// Get all products
export const getProducts = (limit = 20, skip = 0) => {
  console.log("Product", Product.find());

  return Product.find().limit(limit).skip(skip);
};

// Get by MongoDB _id
export const getProductById = (id) => Product.findById(id);

// Get by your custom productId
export const getProductByProductId = (productId) =>
  Product.findOne({ productId });

// Search products
export const searchProducts = (keyword) =>
  Product.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { brand: { $regex: keyword, $options: "i" } },
      { productCategory: { $regex: keyword, $options: "i" } },
    ],
  });

// Add new product
export const addNewProduct = async (data) => {
  const exists = await Product.findOne({ productId: data.productId });
  if (exists) throw new Error("Product ID already exists");
  return Product.create(data);
};

// Update by _id
export const updateProduct = (id, data) =>
  Product.findByIdAndUpdate(id, data, { new: true });

// Delete by _id
export const deleteProduct = (id) => Product.findByIdAndDelete(id);
