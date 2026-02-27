import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Cart Items Array
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: String,
        productImage: String,
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        size: String,
        color: String,
      },
    ],

    // Cart Status
    status: {
      type: String,
      enum: ["active", "abandoned"],
      default: "active",
    },

    // Timestamps
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Index for user lookups
cartSchema.index({ userId: 1 });

export default mongoose.model("Cart", cartSchema);
