import Address from "../models/Address.js";
import User from "../models/User.js";

// Get User Addresses
export const getUserAddresses = async (userId) => {
  try {
    const user = await User.findById(userId).select("addresses");
    if (!user) throw new Error("User not found");
    // return in reverse createdAt order if timestamps exist on subdocs
    return (user.addresses || []).slice().reverse();
  } catch (error) {
    throw new Error(`Failed to fetch addresses: ${error.message}`);
  }
};

// Get Address by ID
export const getAddressById = async (addressId, userId) => {
  try {
    const user = await User.findById(userId).select("addresses");
    if (!user) throw new Error("User not found");
    const addr = user.addresses.id(addressId);
    if (!addr) throw new Error("Address not found");
    return addr;
  } catch (error) {
    throw new Error(`Failed to fetch address: ${error.message}`);
  }
};

// Create Address
export const createAddress = async (userId, addressData) => {
  try {
    const { type, isDefault } = addressData;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // If setting as default, unset other defaults of same type
    if (isDefault) {
      user.addresses.forEach((a) => {
        if (a.type === type) a.isDefault = false;
      });
    }

    const created = user.addresses.create({
      ...addressData,
    });
    user.addresses.push(created);
    await user.save();

    return created;
  } catch (error) {
    throw new Error(`Failed to create address: ${error.message}`);
  }
};

// Update Address
export const updateAddress = async (addressId, userId, updates) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const addr = user.addresses.id(addressId);
    if (!addr) throw new Error("Address not found");

    // Handle default address logic
    if (updates.isDefault && updates.isDefault !== addr.isDefault) {
      if (updates.isDefault) {
        user.addresses.forEach((a) => {
          if (a.type === addr.type && a._id.toString() !== addressId)
            a.isDefault = false;
        });
      }
    }

    Object.keys(updates).forEach((k) => {
      addr[k] = updates[k];
    });

    await user.save();
    return addr;
  } catch (error) {
    throw new Error(`Failed to update address: ${error.message}`);
  }
};

// Delete Address
export const deleteAddress = async (addressId, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    const addr = user.addresses.id(addressId);
    if (!addr) throw new Error("Address not found");
    addr.remove();
    await user.save();
    return "Address deleted successfully";
  } catch (error) {
    throw new Error(`Failed to delete address: ${error.message}`);
  }
};

// Set Default Address
export const setDefaultAddress = async (addressId, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    const addr = user.addresses.id(addressId);
    if (!addr) throw new Error("Address not found");

    user.addresses.forEach((a) => {
      if (a.type === addr.type) a.isDefault = a._id.toString() === addressId;
    });

    await user.save();
    return user.addresses.id(addressId);
  } catch (error) {
    throw new Error(`Failed to set default address: ${error.message}`);
  }
};

// Get Default Address by Type
export const getDefaultAddressByType = async (userId, type) => {
  try {
    const user = await User.findById(userId).select("addresses");
    if (!user) throw new Error("User not found");
    return user.addresses.find((a) => a.type === type && a.isDefault) || null;
  } catch (error) {
    throw new Error(`Failed to fetch default address: ${error.message}`);
  }
};
