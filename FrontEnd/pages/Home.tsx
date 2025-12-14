import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { fetchBrandProductsShop, fetchShopProducts } from '@/api/productApi';
import { div } from 'three/tsl';

export const Home: React.FC = () => {
  const { addToCart } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState([])

  const [adidasProducts, setAdidasProducts] = useState([]);
  const [zaraProducts, setZaraProducts] = useState([]);

  const [loading, setLoading] = useState(false);


  const loadProducts = async () => {
    setLoading(true);
    try {
      /* ------------------ ALL PRODUCTS ------------------ */
      const shopRes = await fetchShopProducts(38, 0);

      console.log("Raw Shop Products:", shopRes);

      const formatted = shopRes.shopProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        brand: p.brand,
        category: p.category || p.brand, // fallback
        rating: Number(p.rate || 4.5),
        isNew: p.bestseller ?? false,
      }));

      setFeaturedProducts(formatted);

      /* ------------------ BRAND BESTSELLERS ------------------ */
      const [adidasRes, zaraRes] = await Promise.all([
        fetchBrandProductsShop("ADIDAS", 20, 0),
        fetchBrandProductsShop("ZARA", 20, 0),
      ]);

      console.log("Adidas Products:", adidasRes.BrandProductsShop);
      console.log("Zara Products:", zaraRes.BrandProductsShop);

      // Optional state setters
      setAdidasProducts(adidasRes.BrandProductsShop);
      setZaraProducts(zaraRes.BrandProductsShop);

    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* 🎥 Background Video */}
        <video
          src="/m1.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 🌑 Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* 🧠 Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white text-center max-w-2xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold tracking-wide mb-6">
              NEW COLLECTION 2025
            </span>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6">
              Future of <br />
              <span className="text-indigo-400">Minimalism</span>
            </h1>

            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Experience the perfect blend of form and function. Curated essentials
              designed for the modern lifestyle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <button className="px-8 py-4 bg-white text-slate-900 rounded-full font-medium hover:bg-indigo-600 hover:text-white transition-all shadow-lg">
                  Shop Now
                </button>
              </Link>

              <Link to="/shop">
                <button className="px-8 py-4 border border-white/40 text-white rounded-full font-medium hover:bg-white/10 transition-all flex items-center gap-2 group">
                  Explore Collections
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

      </section>

      {/* Featured Collection */}


      {loading && (
        <div className="mx-auto mt-6 mb-6 w-[900px] max-w-full
                  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      )}



      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Trending Now</h2>
              <p className="text-slate-500">Handpicked favorites for this season.</p>
            </div>
            <Link to="/shop" className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {
            !loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product, index) => {
                  const rating = Number(product.rate || product.rating || 0);

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative"
                    >
                      {/* IMAGE */}
                      <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-4 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {product.isNew && (
                          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md">
                            NEW
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <button
                          onClick={() => addToCart(product)}
                          className="absolute bottom-4 right-4 bg-white text-slate-900 p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 hover:text-white"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>

                      {/* TEXT */}
                      <h3 className="font-semibold text-slate-900 text-lg line-clamp-2">
                        {product.name}
                      </h3>

                      {/* BRAND / CATEGORY FALLBACK */}
                      <p className="text-slate-500 text-sm mb-2">
                        {product.category || product.brand}
                      </p>

                      {/* PRICE + RATING */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-900">
                          {(
                            product.price +
                            (product.price * (product.tax ?? 0)) / 100
                          ).toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          })}
                        </span>

                        {/* ⭐ Rating */}
                        <div className="flex items-center gap-1 text-amber-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < Math.round(rating)
                                ? "fill-current"
                                : "text-slate-300"
                                }`}
                            />
                          ))}
                          <span className="ml-1 text-slate-400">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )
          }


        </div>
      </section>

      {/* ADIDAS SECTION */}
      <BrandSection
        title="ADIDAS"
        loading={loading}
        products={adidasProducts}
        addToCart={addToCart}
      />

      {/* ZARA SECTION */}
      <BrandSection
        loading={loading}
        title="ZARA"
        products={zaraProducts}
        addToCart={addToCart}
      />


      {/* Newsletter */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Join the Inner Circle</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Subscribe to our newsletter for exclusive drops, early access to sales, and design inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 px-6 py-3 rounded-full border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button className="px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-indigo-600 transition-colors shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


const ProductSkeleton = () => (
  <div className="bg-white rounded-xl border overflow-hidden animate-pulse">
    <div className="aspect-square bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="h-8 bg-slate-300 rounded" />
    </div>
  </div>
);

const BrandSection = ({ title, products, addToCart, loading }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {title}
            </h2>
            <p className="text-slate-500">
              Best picks from {title}
            </p>
          </div>
          <Link
            to={`/shop?brand=${title}`}
            className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
            : products.map((product: any, index: number) => {
              const rating = Number(product.rate || product.rating || 0);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-4 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {product.bestseller && (
                      <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-md">
                        BESTSELLER
                      </span>
                    )}

                    <button
                      onClick={() => addToCart(product)}
                      className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-indigo-600 hover:text-white"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-slate-900 text-lg line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-2">
                    {product.category || product.brand}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">
                      {(
                        product.price +
                        (product.price * (product.tax ?? 0)) / 100
                      ).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      })}
                    </span>

                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.round(rating)
                            ? "fill-current"
                            : "text-slate-300"
                            }`}
                        />
                      ))}
                      <span className="ml-1 text-slate-400">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </section>
  );
};
