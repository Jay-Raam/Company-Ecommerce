import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema(
  {
    "Product ID": { type: Number, required: true, unique: true },
    "Product Position": String,
    Promotion: String,
    "Product Category": String,
    Seasonal: String,
    "Sales Volume": Number,

    brand: String,
    url: String,
    name: { type: String, required: true },
    description: String,
    price: Number,
    currency: String,
    terms: String,
    section: String,
    season: String,
    material: String,
    origin: String,
  },
  { timestamps: true }
);

// Create the model
export const Product =
  mongoose.models.Product || mongoose.model("ProductCompany", ProductSchema);
