import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, ShoppingBag, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import { MOCK_PRODUCTS } from '../types';
import { useStore } from '../store';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleCart } = useStore();
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toggleCart(true);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-slate-50 overflow-hidden cursor-pointer border-2 border-transparent hover:border-indigo-600 transition-colors">
                  <img src={product.image} alt="" className="w-full h-full object-cover opacity-70 hover:opacity-100" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-2 text-indigo-600 font-medium">{product.category}</div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-slate-400 text-sm">124 Reviews</span>
            </div>

            <div className="text-3xl font-medium text-slate-900 mb-8">${product.price}</div>

            <p className="text-slate-600 leading-relaxed mb-8">
              {product.description} Designed with precision and crafted from premium materials to ensure durability and style. Perfect for everyday use.
            </p>

            <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-4">
               <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  Free shipping on all orders over $100
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-600">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  2-year warranty included
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-slate-200 rounded-full px-4 h-14 w-32 justify-between">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-500 hover:text-slate-900">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-slate-500 hover:text-slate-900">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-slate-900 text-white h-14 rounded-full font-medium hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};