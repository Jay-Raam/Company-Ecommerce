// controllers/ProductController.js
import { Product } from "../models/ProductModal.js";

export const getProducts = async (limit = 20, skip = 0) => {
  return await Product.find().limit(limit).skip(skip).sort({ createdAt: -1 });
};

export const getProductsShop = async (limit = 20, skip = 0, filter = {}) => {
  console.log("Filter received in getProductsShop:", limit, skip, filter);

  const USD_TO_INR = 90; // 🔁 today approx

  const raw = await Product.find(filter).limit(limit).skip(skip);

  const extractSize = (title = "") => {
    const match = title.match(/-\s([A-Z]{1,3})\s-/);
    return match ? match[1] : null;
  };

  // ⭐ Size priority
  const SIZE_PRIORITY = ["M", "L", "S", "XL", "XS", "XXL"];

  // ⭐ Group by base product
  const groups = {};

  raw.forEach((p) => {
    const size = extractSize(p.originalTitle);
    const base = p.originalTitle.replace(/-\s([A-Z]{1,3})\s-/, "- SIZE -");

    if (!groups[base]) groups[base] = [];
    groups[base].push({ doc: p, size });
  });

  // ⭐ Pick best size per group
  const selected = [];

  Object.values(groups).forEach((items) => {
    items.sort(
      (a, b) => SIZE_PRIORITY.indexOf(a.size) - SIZE_PRIORITY.indexOf(b.size)
    );
    selected.push(items[0].doc);
  });

  // ⭐ Map FULL product
  return selected.map((p) => {
    /* ---------- Images ---------- */
    let image = "";
    let mainImageUrls = null;
    try {
      mainImageUrls = JSON.parse(p.mainImageUrls?.replace(/'/g, '"'));
      image = mainImageUrls?.defaultSize ?? "";
    } catch {}

    /* ---------- Price ---------- */
    let price = null;
    let priceINR = null;
    let priceInformation = null;
    try {
      priceInformation = JSON.parse(p.priceInformation?.replace(/'/g, '"'));
      price = priceInformation.displayPriceAmount.valueInCents / 100;
      priceINR = Math.round(price * USD_TO_INR);
    } catch {}

    /* ---------- Popularity ---------- */
    let popularityInformation = null;
    try {
      popularityInformation = JSON.parse(
        p.popularityInformation?.replace(/'/g, '"')
      );
    } catch {}

    return {
      // 🔑 Core
      id: p._id,
      name: p.originalTitle,
      rate: p.rate,
      price: priceINR,
      image,
      brand: p.brand,
      category: p.normalizedCategoryPath,
      size: extractSize(p.originalTitle),

      tax: p.tax ?? null,

      // 🏷 Identifiers
      gtin: p.gtin ?? null,
      sku: p.sku ?? null,

      // 🌐 URLs
      originalWebpageUrl: p.originalWebpageUrl ?? null,
      processedWebpageUrl: p.processedWebpageUrl ?? null,
      mainImageUrls,

      // 🌍 Locale & description
      localeCode: p.localeCode ?? null,
      shortDescription: p.shortDescription ?? null,
      longDescription: p.longDescription ?? null,

      // 📦 Stock & price metadata
      stockAvailabilityInformation: p.stockAvailabilityInformation ?? null,
      priceInformation,

      // 🧠 Context & merchant
      contextualInformation: p.contextualInformation ?? null,
      merchantProductOfferId: p.merchantProductOfferId ?? null,
      merchantId: p.merchantId ?? null,

      // ⭐ Popularity
      popularityInformation,
    };
  });
};

export const getBrandProductsShop = async (
  brand,
  limit = 20,
  skip = 0,
  filter = {}
) => {
  console.log("getBrandProductsShop:", brand, limit, skip, filter);

  const USD_TO_INR = 90;

  // Brand filter applied here
  const finalFilter = {
    ...filter,
    brand: brand?.toUpperCase(),
    bestseller: true,
  };

  const raw = await Product.find(finalFilter).limit(limit).skip(skip);

  const extractSize = (title = "") => {
    const match = title.match(/-\s([A-Z]{1,3})\s-/);
    return match ? match[1] : null;
  };

  const SIZE_PRIORITY = ["M", "L", "S", "XL", "XS", "XXL"];

  const groups = {};

  raw.forEach((p) => {
    const size = extractSize(p.originalTitle);
    const base = p.originalTitle.replace(/-\s([A-Z]{1,3})\s-/, "- SIZE -");

    if (!groups[base]) groups[base] = [];
    groups[base].push({ doc: p, size });
  });

  const selected = [];

  Object.values(groups).forEach((items) => {
    items.sort(
      (a, b) => SIZE_PRIORITY.indexOf(a.size) - SIZE_PRIORITY.indexOf(b.size)
    );
    selected.push(items[0].doc);
  });

  return selected.map((p) => {
    console.log("p", p);

    let image = "";
    let mainImageUrls = null;

    try {
      mainImageUrls = JSON.parse(p.mainImageUrls?.replace(/'/g, '"'));
      image = mainImageUrls?.defaultSize ?? "";
    } catch {}

    let priceINR = null;
    let priceInformation = null;

    try {
      priceInformation = JSON.parse(p.priceInformation?.replace(/'/g, '"'));
      const priceUSD = priceInformation.displayPriceAmount.valueInCents / 100;
      priceINR = Math.round(priceUSD * USD_TO_INR);
    } catch {}

    let popularityInformation = null;
    try {
      popularityInformation = JSON.parse(
        p.popularityInformation?.replace(/'/g, '"')
      );
    } catch {}

    return {
      id: p._id,
      name: p.originalTitle,
      price: priceINR,
      image,
      brand: p.brand,
      bestseller: p.bestseller ?? false,
      category: p.normalizedCategoryPath,
      size: extractSize(p.originalTitle),

      gtin: p.gtin ?? null,
      sku: p.sku ?? null,

      tax: p.tax ?? null,

      rate: p.rate,

      originalWebpageUrl: p.originalWebpageUrl ?? null,
      processedWebpageUrl: p.processedWebpageUrl ?? null,
      mainImageUrls,

      localeCode: p.localeCode ?? null,
      shortDescription: p.shortDescription ?? null,
      longDescription: p.longDescription ?? null,

      stockAvailabilityInformation: p.stockAvailabilityInformation ?? null,
      priceInformation,

      contextualInformation: p.contextualInformation ?? null,
      merchantProductOfferId: p.merchantProductOfferId ?? null,
      merchantId: p.merchantId ?? null,

      popularityInformation,
    };
  });
};

export const getProductById = async (id) => {
  const USD_TO_INR = 90;

  const p = await Product.findById(id);
  if (!p) return null;

  // 🖼 Image
  let image = "";
  let mainImageUrls = null;
  try {
    mainImageUrls = JSON.parse(p.mainImageUrls?.replace(/'/g, '"'));
    image = mainImageUrls?.defaultSize ?? "";
  } catch {}

  // 💰 Price
  let priceINR = null;
  let priceInformation = null;
  try {
    priceInformation = JSON.parse(p.priceInformation?.replace(/'/g, '"'));
    const priceUSD = priceInformation.displayPriceAmount.valueInCents / 100;
    priceINR = Math.round(priceUSD * USD_TO_INR);
  } catch {}

  // ⭐ Popularity
  let popularityInformation = null;
  try {
    popularityInformation = JSON.parse(
      p.popularityInformation?.replace(/'/g, '"')
    );
  } catch {}

  return {
    id: p._id,
    name: p.originalTitle,
    price: priceINR,
    image,
    brand: p.brand,
    bestseller: p.bestseller ?? false,
    rate: Number(p.rate) || 4,
    category: p.normalizedCategoryPath,
    size: null,

    tax: p.tax ?? null,

    gtin: p.gtin ?? null,
    sku: p.sku ?? null,

    originalWebpageUrl: p.originalWebpageUrl ?? null,
    processedWebpageUrl: p.processedWebpageUrl ?? null,
    mainImageUrls,

    localeCode: p.localeCode ?? null,
    shortDescription: p.shortDescription ?? null,
    longDescription: p.longDescription ?? null,

    stockAvailabilityInformation: p.stockAvailabilityInformation ?? null,
    priceInformation,

    contextualInformation: p.contextualInformation ?? null,
    merchantProductOfferId: p.merchantProductOfferId ?? null,
    merchantId: p.merchantId ?? null,

    popularityInformation,
  };
};

export const getShopMeta = async () => {
  const USD_TO_INR = 90; // 🔁 Today approx rate

  const raw = await Product.find({});

  const categories = new Set();
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  raw.forEach((p) => {
    // 📂 Category
    if (p.normalizedCategoryPath) {
      categories.add(p.normalizedCategoryPath);
    }

    // 💰 Price (USD ➜ INR)
    try {
      const priceObj = JSON.parse(p.priceInformation.replace(/'/g, '"'));

      const priceUSD = priceObj.displayPriceAmount.valueInCents / 100;

      const priceINR = Math.round(priceUSD * USD_TO_INR);

      if (priceINR < minPrice) minPrice = priceINR;
      if (priceINR > maxPrice) maxPrice = priceINR;
    } catch {}
  });

  // 🛡 Safety fallback (empty DB)
  if (minPrice === Infinity) minPrice = 0;
  if (maxPrice === -Infinity) maxPrice = 0;

  return {
    categories: [...categories],
    minPrice,
    maxPrice,
    currency: "INR",
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
