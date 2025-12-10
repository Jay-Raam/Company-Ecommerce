import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThreeHero } from '../components/ThreeScene';
import { MOCK_PRODUCTS } from '../types';
import { useStore } from '../store';
import { fetchProducts } from '@/api/productApi';

export const Home: React.FC = () => {
  const { addToCart } = useStore();
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);

  useEffect(() => {
    fetchProducts(20, 0).then(data => console.log(data));
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-slate-50 overflow-hidden pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 order-2 lg:order-1"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold tracking-wide mb-6">
              NEW COLLECTION 2025
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-tight mb-6">
              Future of <br/>
              <span className="text-indigo-600">Minimalism</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              Experience the perfect blend of form and function. Curated essentials designed for the modern lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 hover:scale-105 transition-all shadow-lg shadow-slate-900/20">
                  Shop Now
                </button>
              </Link>
              <Link to="/shop">
                <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-medium hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
                  Explore Collections
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-[50vh] lg:h-[80vh] w-full order-1 lg:order-2"
          >
            <ThreeHero className="w-full h-full" />
          </motion.div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent -z-10" />
      </section>

      {/* Featured Collection */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
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
                <h3 className="font-semibold text-slate-900 text-lg">{product.name}</h3>
                <p className="text-slate-500 text-sm mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-900">${product.price}</span>
                  <div className="flex items-center text-amber-400 text-xs">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="ml-1 text-slate-400">{product.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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