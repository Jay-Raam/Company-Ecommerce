// controllers/ProductController.js
import { Product } from "../models/ProductModal.js";

export const getProducts = async (limit = 20, skip = 0) => {
  return await Product.find().limit(limit).skip(skip).sort({ createdAt: -1 });
};

export const getProductsShop = async (limit = 20, skip = 0, filter = {}) => {
  const raw = await Product.find(filter).limit(limit).skip(skip);

  const extractSize = (title) => {
    const match = title.match(/-\s([A-Z]{1,3})\s-/);
    return match ? match[1] : null;
  };

  // ⭐ Priority order
  const SIZE_PRIORITY = ["M", "L", "S", "XL", "XS", "XXL"];

  // ⭐ Group products by base name (same coat, different sizes)
  const groups = {};

  raw.forEach((p) => {
    const size = extractSize(p.originalTitle);

    // base key (remove size part)
    const base = p.originalTitle.replace(/-\s([A-Z]{1,3})\s-/, "- SIZE -");

    if (!groups[base]) groups[base] = [];
    groups[base].push({ doc: p, size });
  });

  // ⭐ Choose best product per group
  const selected = [];

  Object.values(groups).forEach((items) => {
    // Sort by priority
    items.sort((a, b) => {
      return SIZE_PRIORITY.indexOf(a.size) - SIZE_PRIORITY.indexOf(b.size);
    });

    // Pick highest priority
    selected.push(items[0].doc);
  });

  // ⭐ Map to final output format
  return selected.map((p) => {
    let image = "";
    try {
      const img = JSON.parse(p.mainImageUrls.replace(/'/g, '"'));
      image = img.defaultSize;
    } catch {}

    let price = null;
    try {
      const priceObj = JSON.parse(p.priceInformation.replace(/'/g, '"'));
      price = priceObj.displayPriceAmount.valueInCents / 100;
    } catch {}

    let brand = "";
    try {
      const info = JSON.parse(p.contextualInformation.replace(/'/g, '"'));
      brand = info.originalBrandName;
    } catch {}

    return {
      id: p._id,
      name: p.originalTitle,
      price,
      image,
      brand,
      category: p.normalizedCategoryPath,
      size: extractSize(p.originalTitle),
    };
  });
};

export const getProductById = async (id) => {
  return await Product.findById(id);
};

export const getShopMeta = async () => {
  const raw = await Product.find({}); // all products

  const categories = new Set();
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  raw.forEach((p) => {
    // Category
    if (p.normalizedCategoryPath) categories.add(p.normalizedCategoryPath);

    // Price
    try {
      const priceObj = JSON.parse(p.priceInformation.replace(/'/g, '"'));
      const price = priceObj.displayPriceAmount.valueInCents / 100;

      if (price < minPrice) minPrice = price;
      if (price > maxPrice) maxPrice = price;
    } catch {}
  });

  return {
    categories: [...categories],
    minPrice,
    maxPrice,
  };
};

export const searchProducts = async (keyword) => {
  return await Product.find({
    originalTitle: { $regex: keyword, $options: "i" },
  });
};

export const addNewProduct = async (data) => {
  return await Product.create(data);
};

export const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};
