import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Order Number
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    // User & Addresses
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    billingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    // Order Items
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        productName: String,
        productImage: String,
        price: Number,
        quantity: Number,
        size: String,
        color: String,
      },
    ],

    // Pricing
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponCode: String,
    total: {
      type: Number,
      required: true,
    },

    // Payment Info
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "upi", "net_banking", "wallet"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: String,

    // Order Status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // Tracking
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date,

    // Notes
    specialInstructions: String,
    cancellationReason: String,

    // Status History
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        notes: String,
      },
    ],
  },
  { timestamps: true },
);

// Generate unique order number
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

// Index for lookups
orderSchema.index({ userId: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

export default mongoose.model("Order", orderSchema);
