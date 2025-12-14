import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { Product } from "../types";
import { useStore } from "../store";
import { fetchBrandProductsShop, fetchShopProducts } from "@/api/productApi";

/* -------------------- UTILS -------------------- */

const formatINR = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

/* -------------------- SHOP -------------------- */

export const Shop: React.FC = () => {
  const { addToCart } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [limit] = useState(40);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);


  // Filters
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState<number | null>(null);

  // Derived meta
  const [brands, setBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  // filter
  type SortOption = "featured" | "price_low" | "price_high" | "newest" | "top_rated";

  const [sortBy, setSortBy] = useState<SortOption>("featured");



  /* -------------------- LOAD PRODUCTS -------------------- */

  useEffect(() => {
    loadMoreProducts();
  }, []);

  const loadMoreProducts = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetchShopProducts(limit, skip);
      const newProducts = res.shopProducts;

      if (!newProducts || newProducts.length === 0) {
        setHasMore(false);
        return;
      }

      setProducts((prev) => [...prev, ...newProducts]);
      setSkip((prev) => prev + limit);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  /* -------------------- DERIVE META FROM PRODUCTS -------------------- */

  useEffect(() => {
    if (products.length === 0) return;

    const uniqueBrands = Array.from(
      new Set(products.map((p) => p.brand).filter(Boolean))
    );

    const prices = products
      .map((p) => p.price)
      .filter((p): p is number => typeof p === "number");

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    setBrands(["All", ...uniqueBrands]);
    setMinPrice(min);
    setMaxPrice(max);

    // set slider only once
    setPriceRange((prev) => (prev === null ? max : prev));
  }, [products]);

  /* -------------------- FILTERING -------------------- */

  const filteredProducts = useMemo(() => {
    let res = products.filter((product) => {
      const matchBrand =
        selectedBrand === "All" || product.brand === selectedBrand;

      const matchPrice =
        priceRange === null || product.price <= priceRange;

      return matchBrand && matchPrice;
    });

    switch (sortBy) {
      case "price_low":
        res = res.sort((a, b) => a.price - b.price);
        break;

      case "price_high":
        res = res.sort((a, b) => b.price - a.price);
        break;

      case "top_rated":
        res = res.sort(
          (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
        );
        break;

      default:
        break; // featured (API order)
    }
    console.log("Filtered Products:", res);
    return res;

  }, [products, selectedBrand, priceRange, sortBy]);


  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Shop Collection
          </h1>
          <p className="text-slate-500">Curated essentials. No noise.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 space-y-8">
            <div className="sticky top-24 space-y-8">

              {/* Brand */}
              <div>
                <h3 className="font-semibold mb-3">Brand</h3>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <h3 className="font-semibold mb-3">Price Range (₹)</h3>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange ?? maxPrice}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>{formatINR(minPrice)}</span>
                  <span>{formatINR(priceRange ?? maxPrice)}</span>
                </div>
              </div>

            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">

            <div className="flex justify-between items-center mb-6">
              {/* Left: product count */}
              <span className="text-sm text-slate-500">
                {initialLoading
                  ? "Loading products…"
                  : `${filteredProducts.length} products`}
              </span>

              {/* Right: sort dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none border border-slate-200
                 rounded-lg px-3 py-1.5 pr-8 text-sm
                 bg-white text-slate-900 cursor-pointer
                 hover:border-slate-400 transition"
                >
                  <option value="featured">Featured</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="top_rated">Top Rated</option>
                </select>

                <ChevronDown className="w-4 h-4 absolute right-2 top-2.5
                            pointer-events-none text-slate-500" />
              </div>
            </div>


            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {initialLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
                : filteredProducts.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    onAdd={() => addToCart(product)}
                  />
                ))}
            </div>

            {/* Empty */}
            {!initialLoading && filteredProducts.length === 0 && (
              <div className="text-center py-24 text-slate-500">
                No products match your filters.
              </div>
            )}

            {/* Load more */}
            {hasMore && !initialLoading && (
              <div className="text-center mt-10">
                <button
                  onClick={loadMoreProducts}
                  disabled={loading}
                  className="px-6 py-3 bg-slate-900 text-white rounded-lg
                             hover:bg-indigo-600 disabled:opacity-60"
                >
                  {loading ? "Loading…" : "View More"}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------- PRODUCT CARD -------------------- */

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-500">★</span>
      ))}

      {hasHalfStar && (
        <span className="text-yellow-500">☆</span>
      )}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={`empty-${i}`} className="text-slate-300">★</span>
      ))}

      <span className="ml-1 text-xs text-slate-500">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const ProductCard: React.FC<{
  product: Product;
  onAdd: () => void;
}> = ({ product, onAdd }) => {



  const navigater = useNavigate();

  const EUR_TO_INR = 90;
  const inStock =
    product.stockAvailabilityInformation?.includes("in_stock");

  const originalINR =
    product.priceInformation?.originalPriceAmount?.valueInCents
      ? Math.round(
        (product.priceInformation.originalPriceAmount.valueInCents / 100) *
        EUR_TO_INR
      )
      : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group bg-white rounded-xl border border-slate-100
                 overflow-hidden hover:shadow-lg transition"
    >
      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        className="block aspect-square bg-gray-100 overflow-hidden relative"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover
                     group-hover:scale-105 transition-transform duration-500"
        />

        {/* Size badge */}
        {product.size && (
          <span className="absolute top-2 left-2 bg-white/90
                           text-xs font-semibold px-2 py-1 rounded">
            Size {product.size}
          </span>
        )}

        {/* Stock badge */}
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-1 rounded
            ${inStock ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </Link>

      {/* Content */}
      <div
        className="p-4"
        onClick={() => navigater(`/product/${product.id}`)}
      >

        {/* Brand */}
        <p className="text-xs font-semibold text-slate-500 uppercase">
          {product.brand}
        </p>


        {/* Name */}
        <h3
          className="font-semibold text-slate-900 leading-snug
                     line-clamp-2 hover:text-indigo-600 transition mt-1"
          title={product.name}
        >
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="mt-1">
          {renderStars(Number(product.rate) || 0)}
        </div>
        {/* Price */}
        <div className="mt-3">
          <span className="font-semibold text-lg text-slate-900">
            {formatINR(
              product.price +
              (product.price * (product.tax ?? 0)) / 100
            )}
          </span>


          {originalINR > product.price && (
            <span className="ml-2 text-sm text-slate-400 line-through">
              {formatINR(originalINR)}
            </span>
          )}
        </div>

        {/* Actions */}
        <button
          onClick={onAdd}
          disabled={!inStock}
          className={`w-full mt-4 py-2 rounded-lg text-sm font-medium
            flex items-center justify-center gap-2 transition
            ${inStock
              ? "bg-slate-900 text-white hover:bg-indigo-600"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </motion.div>
  );
};


/* -------------------- SKELETON -------------------- */

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl border overflow-hidden animate-pulse">
    <div className="aspect-square bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="h-8 bg-slate-300 rounded" />
    </div>
  </div>
);
