import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ArrowRight, CreditCard } from 'lucide-react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

export const CartSidebar: React.FC = () => {
  const { cart, isCartOpen, toggleCart, updateQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-900">Your Cart ({cart.length})</h2>
              <button onClick={() => toggleCart(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center text-slate-500 mt-20">
                  <p>Your cart is empty.</p>
                  <button onClick={() => toggleCart(false)} className="mt-4 text-indigo-600 font-medium">Continue Shopping</button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-slate-900 line-clamp-1">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 mb-2">{item.category}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-slate-200 rounded-full px-2 py-1 gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-slate-500 hover:text-slate-900"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-slate-500 hover:text-slate-900"><Plus className="w-3 h-3" /></button>
                        </div>
                        <span className="font-medium text-slate-900">${item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-slate-50">
                <div className="flex justify-between mb-4 text-lg font-bold text-slate-900">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <p className="text-xs text-slate-500 mb-4 text-center">Shipping & taxes calculated at checkout.</p>
                <button 
                  onClick={() => { toggleCart(false); navigate('/checkout'); }}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const Checkout: React.FC = () => {
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 20;
  const total = subtotal + shipping;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      clearCart();
      alert("Order placed successfully! (Mock)");
      navigate('/');
    }, 2000);
  };

  if (cart.length === 0) return <div className="pt-32 text-center">Your cart is empty</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <form id="checkout-form" onSubmit={handlePayment} className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
                  <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-4">Payment Method (Mock)</h2>
              <div className="p-4 border border-indigo-100 bg-indigo-50 rounded-lg flex items-center gap-3 mb-4">
                <CreditCard className="text-indigo-600" />
                <span className="text-indigo-900 font-medium">Credit Card (Stripe/Razorpay Integration)</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Card Number" className="col-span-2 px-4 py-2 rounded-lg border border-slate-200" />
                <input placeholder="MM/YY" className="px-4 py-2 rounded-lg border border-slate-200" />
                <input placeholder="CVC" className="px-4 py-2 rounded-lg border border-slate-200" />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:pl-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4 max-h-60 overflow-y-auto mb-4 no-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.image} alt="" className="w-12 h-12 rounded bg-slate-50 object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">${item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>${shipping}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={loading}
                className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};