import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "../store";
import { fetchShopProductById } from "../api/productApi";

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleCart } = useStore();

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  /* ------------------ Load Product ------------------ */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetchShopProductById(id);
        setProduct(res.product);
      } catch (err) {
        console.error("Error loading product", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading product…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );
  }

  /* ------------------ Derived values ------------------ */
  const rating = Number(product.rate) || 0;
  const inStock =
    product.stockAvailabilityInformation?.includes("in_stock");

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toggleCart(true);
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden relative">
              {product.bestseller && (
                <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                  Bestseller
                </span>
              )}

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            {/* Category */}
            <div className="mb-2 text-indigo-600 font-medium">
              {product.category}
            </div>

            {/* Name */}
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(rating)
                      ? "fill-current"
                      : "text-slate-300"
                      }`}
                  />
                ))}
              </div>
              <span className="text-slate-400 text-sm">
                {rating.toFixed(1)} Rating
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-medium text-slate-900 mb-8">
              ₹{product.price?.toLocaleString("en-IN")}
            </div>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed mb-8">
              {product.longDescription ||
                product.shortDescription}
            </p>

            {/* Info badges */}
            <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Truck className="w-5 h-5 text-indigo-600" />
                Free shipping on all orders
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                Quality guarantee
              </div>
            </div>

            {/* Quantity + Add */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-slate-200 rounded-full px-4 h-14 w-32 justify-between">
                <button
                  onClick={() =>
                    setQuantity(Math.max(1, quantity - 1))
                  }
                  className="text-slate-500 hover:text-slate-900"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-slate-500 hover:text-slate-900"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 h-14 rounded-full font-medium flex items-center justify-center gap-2 transition shadow-lg
                  ${inStock
                    ? "bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-200"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
