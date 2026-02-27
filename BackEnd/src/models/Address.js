import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Address Details
    type: {
      type: String,
      enum: ["billing", "shipping"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "India",
    },

    // Default Address
    isDefault: {
      type: Boolean,
      default: false,
    },

    // Special Instructions
    instructions: String,
  },
  { timestamps: true },
);

// Index for user lookups
addressSchema.index({ userId: 1 });

export default mongoose.model("Address", addressSchema);
