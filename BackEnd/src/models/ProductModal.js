import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    gtin: String,
    sku: String,

    originalWebpageUrl: String,
    processedWebpageUrl: String,
    mainImageUrls: String,

    localeCode: String,
    originalTitle: String,
    shortDescription: String,
    longDescription: String,

    stockAvailabilityInformation: String,
    priceInformation: String,
    contextualInformation: String,

    merchantProductOfferId: String,
    merchantId: String,

    normalizedCategoryPath: String,
    popularityInformation: Object,
  },
  {
    timestamps: true,
    collection: "ProductMain",
  }
);

export const Product =
  mongoose.models.ProductMain || mongoose.model("ProductMain", ProductSchema);
