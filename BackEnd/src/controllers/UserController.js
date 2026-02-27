import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "access-token-secret-key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret-key";

// Generate Access Token (short-lived: 15 minutes)
const generateAccessToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role, type: "access" },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

// Generate Refresh Token (long-lived: 7 days)
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId, type: "refresh" }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// Register User
export const registerUser = async (name, email, password, phone = "") => {
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.email, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in database with expiry
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    await User.findByIdAndUpdate(user._id, {
      refreshToken,
      refreshTokenExpiry,
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

// Login User
export const loginUser = async (email, password) => {
  console.log("Login attempt for email containing:", email, password);

  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    console.log("User found, generating tokens for:", user.email);

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.email, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in database with expiry
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    await User.findByIdAndUpdate(user._id, {
      refreshToken,
      refreshTokenExpiry,
      lastLogin: new Date(),
    });

    console.log("Tokens generated and stored for:", user.email);

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  } catch (error) {
    console.error("Login error details:", {
      message: error.message,
      stack: error.stack,
      email,
    });
    throw new Error(error.message || "Login failed");
  }
};

// Refresh Access Token
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Check if token is stored in database
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    // Check if refresh token is expired
    if (new Date() > user.refreshTokenExpiry) {
      throw new Error("Refresh token expired");
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id, user.email, user.role);

    return {
      accessToken: newAccessToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  } catch (error) {
    throw new Error(`Token refresh failed: ${error.message}`);
  }
};

// Get User Profile
export const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(`Profile retrieval failed: ${error.message}`);
  }
};

// Update User Profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const allowedUpdates = ["name", "phone", "newsletter"];
    const filteredUpdates = {};

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
      new: true,
    }).select("-password -refreshToken");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(`Update failed: ${error.message}`);
  }
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (decoded.type !== "access") {
      throw new Error("Invalid token type");
    }
    return decoded;
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    if (decoded.type !== "refresh") {
      throw new Error("Invalid token type");
    }
    return decoded;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

// Change Password
export const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash and set new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Invalidate refresh token on password change
    user.refreshToken = null;
    user.refreshTokenExpiry = null;

    await user.save();

    return "Password changed successfully";
  } catch (error) {
    throw new Error(`Password change failed: ${error.message}`);
  }
};

// Logout User
export const logoutUser = async (userId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        refreshToken: null,
        refreshTokenExpiry: null,
      },
      { new: true },
    );

    if (!user) {
      throw new Error("User not found");
    }

    return "Logged out successfully";
  } catch (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
};

// Delete User Account
export const deleteUserAccount = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return "Account deleted successfully";
  } catch (error) {
    throw new Error(`Deletion failed: ${error.message}`);
  }
};
