import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// Create Order
export const createOrder = async (userId, orderData) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod } = orderData;

    if (!items || items.length === 0) {
      throw new Error("Order must contain items");
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = Math.round(subtotal * 0.1); // 10% tax
    const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
    const total = subtotal + tax + shippingCost;

    // Create order
    const order = await Order.create({
      userId,
      items,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      total,
      statusHistory: [
        {
          status: "pending",
          notes: "Order created",
        },
      ],
    });

    // Clear cart
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    return order;
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

// Get User Orders
export const getUserOrders = async (userId, limit = 20, skip = 0) => {
  try {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Order.countDocuments({ userId });

    return {
      orders,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }
};

// Get Order by ID
export const getOrderById = async (orderId, userId) => {
  try {
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  } catch (error) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }
};

// Update Order Status
export const updateOrderStatus = async (orderId, newStatus, notes = "") => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = newStatus;
    order.statusHistory.push({
      status: newStatus,
      notes,
    });

    if (newStatus === "delivered") {
      order.actualDelivery = new Date();
    }

    await order.save();
    return order;
  } catch (error) {
    throw new Error(`Failed to update order: ${error.message}`);
  }
};

// Cancel Order
export const cancelOrder = async (orderId, userId, reason = "") => {
  try {
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      throw new Error("Order not found");
    }

    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      throw new Error("Cannot cancel this order");
    }

    order.status = "cancelled";
    order.cancellationReason = reason;
    order.statusHistory.push({
      status: "cancelled",
      notes: reason,
    });

    await order.save();
    return order;
  } catch (error) {
    throw new Error(`Failed to cancel order: ${error.message}`);
  }
};

// Track Order
export const trackOrder = async (orderId, userId) => {
  try {
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      throw new Error("Order not found");
    }

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      statusHistory: order.statusHistory,
    };
  } catch (error) {
    throw new Error(`Failed to track order: ${error.message}`);
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (limit = 20, skip = 0, filter = {}) => {
  try {
    const orders = await Order.find(filter)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Order.countDocuments(filter);

    return {
      orders,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }
};

// Get Order Stats (Admin)
export const getOrderStats = async () => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus,
      recentOrders,
    };
  } catch (error) {
    throw new Error(`Failed to fetch stats: ${error.message}`);
  }
};
