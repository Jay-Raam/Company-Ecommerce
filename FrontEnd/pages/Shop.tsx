import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, ShoppingCart } from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES, Product } from '../types';
import { useStore } from '../store';

export const Shop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(500);
  const { addToCart } = useStore();

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price <= priceRange;
      return matchesCategory && matchesPrice;
    });
  }, [selectedCategory, priceRange]);

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Shop Collection</h1>
          <p className="text-slate-500">Discover our curated selection of premium essentials.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8">
            <div className="sticky top-24">
              <div className="mb-8">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Categories
                </h3>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category 
                          ? 'bg-indigo-50 text-indigo-700 font-medium' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Price Range</h3>
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>$0</span>
                  <span>${priceRange}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-slate-500">{filteredProducts.length} products found</span>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Sort by:</span>
                <button className="flex items-center gap-1 font-medium text-slate-900">
                  Featured <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-24">
                <p className="text-slate-500">No products found matching your criteria.</p>
                <button 
                  onClick={() => { setSelectedCategory('All'); setPriceRange(1000); }}
                  className="mt-4 text-indigo-600 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; onAdd: () => void }> = ({ product, onAdd }) => (
  <motion.div
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
  >
    <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </Link>
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <p className="text-sm text-slate-500">{product.category}</p>
        </div>
        <span className="font-medium text-slate-900">${product.price}</span>
      </div>
      <button 
        onClick={(e) => {
          e.preventDefault();
          onAdd();
        }}
        className="w-full mt-2 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-indigo-600"
      >
        <ShoppingCart className="w-4 h-4" /> Add to Cart
      </button>
    </div>
  </motion.div>
);