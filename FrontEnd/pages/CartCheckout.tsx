import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { useStore } from "../store";

// Re-define if not exported
const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export const Checkout: React.FC = () => {
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
  });

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24 pb-12">
        <div className="text-center">
          <p className="text-slate-500">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-indigo-600 font-medium hover:underline"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  console.log("Checkout Cart:", cart);

  // ====== TAX & TOTAL LOGIC (PER ITEM, CORRECT) ======
  const shipping = 100;
  const isTamilNadu = formData.state === "Tamil Nadu";

  let subtotal = 0;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const taxRate = item.tax || 0; // e.g., 5, 12, 18
    const taxAmount = (itemTotal * taxRate) / 100;

    if (isTamilNadu) {
      cgst += taxAmount / 2;
      sgst += taxAmount / 2;
    } else {
      igst += taxAmount;
    }
  });

  const taxTotal = cgst + sgst + igst;
  const total = subtotal + taxTotal + shipping;

  // ====== HANDLE FORM & PAYMENT ======
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      clearCart();
      alert("🎉 Order placed successfully! (Mock)");
      navigate("/");
    }, 1800);
  };

  // ====== RENDER ======
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

        {/* Main layout: Flex instead of Grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* ===== SHIPPING FORM ===== */}
          <div className="flex-1 max-w-2xl">
            <form
              id="checkout-form"
              onSubmit={handlePayment}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Shipping Details</h2>
                <p className="text-sm text-slate-500 mt-1">Enter your delivery address</p>
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-medium text-slate-600 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="John"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs font-medium text-slate-600 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Doe"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-xs font-medium text-slate-600 mb-1">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Street, Apartment, House No."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* City + State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="city" className="block text-xs font-medium text-slate-600 mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Chennai"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-xs font-medium text-slate-600 mb-1">
                    State
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition"
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label htmlFor="pincode" className="block text-xs font-medium text-slate-600 mb-1">
                  ZIP / Pincode
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  placeholder="600001"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Payment Banner */}
              <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Secure Payment</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Payment processed via encrypted gateway. No card data stored.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* ===== ORDER SUMMARY ===== */}
          {/* ===== ORDER SUMMARY ===== */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-28">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h2>

              <div className="max-h-60 overflow-y-auto space-y-3 mb-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* ===== TAX & TOTAL ===== */}
              <div className="space-y-2.5 text-sm border-t border-slate-200 pt-4">

                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">{formatINR(subtotal)}</span>
                </div>

                {/* Tax Breakdown */}
                {isTamilNadu ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">
                        CGST ({((cgst / subtotal) * 100).toFixed(1)}%)
                      </span>
                      <span>{formatINR(cgst)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">
                        SGST ({((sgst / subtotal) * 100).toFixed(1)}%)
                      </span>
                      <span>{formatINR(sgst)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      IGST ({((igst / subtotal) * 100).toFixed(1)}%)
                    </span>
                    <span>{formatINR(igst)}</span>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span>{formatINR(shipping)}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200 mt-2">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full mt-6 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};