import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Personal Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Role & Status
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Preferences
    newsletter: {
      type: Boolean,
      default: false,
    },

    // Account Status
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,

    // Password Reset
    resetToken: String,
    resetTokenExpiry: Date,

    // Tokens
    refreshToken: String,
    refreshTokenExpiry: Date,

    // Timestamps
    lastLogin: Date,
    // Embedded Addresses
    addresses: [
      {
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
        isDefault: {
          type: Boolean,
          default: false,
        },
        instructions: String,
      },
    ],
  },
  { timestamps: true },
);

// Index for email lookups
userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);
