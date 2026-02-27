# Lumina E-Commerce API Documentation

## 🚀 Complete GraphQL API Reference

### Base URL

```
http://localhost:4000/graphql
```

---

## 📋 Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [User Profile APIs](#user-profile-apis)
3. [Address Management APIs](#address-management-apis)
4. [Cart APIs](#cart-apis)
5. [Order APIs](#order-apis)
6. [Product APIs](#product-apis)
7. [Review APIs](#review-apis)
8. [Wishlist APIs](#wishlist-apis)
9. [Newsletter APIs](#newsletter-apis)

---

## 🔐 Authentication APIs

### 1. Register User

**Mutation:**

```graphql
mutation {
  registerUser(
    name: "John Doe"
    email: "john@example.com"
    password: "securePassword123"
    phone: "9876543210"
  ) {
    id
    name
    email
    phone
    role
    accessToken
    refreshToken
    expiresIn
  }
}
```

**Response:**

```json
{
  "data": {
    "registerUser": {
      "id": "user_id_123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "customer",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

**Notes:**

- User is automatically authenticated after registration
- `accessToken`: Used for API requests (expires in 15 minutes)
- `refreshToken`: Used to get new access token (expires in 7 days)
- Include access token in Authorization header: `Bearer <accessToken>`

---

### 2. Login User

**Mutation:**

```graphql
mutation {
  loginUser(email: "john@example.com", password: "securePassword123") {
    id
    name
    email
    phone
    role
    accessToken
    refreshToken
    expiresIn
  }
}
```

**Response:**

```json
{
  "data": {
    "loginUser": {
      "id": "user_id_123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "customer",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

**Notes:**

- Same token structure as register
- Last login timestamp updated in backend

---

### 3. Refresh Access Token

**Mutation:**

```graphql
mutation {
  refreshAccessToken(refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...") {
    accessToken
    expiresIn
  }
}
```

**Response:**

```json
{
  "data": {
    "refreshAccessToken": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

**Error Response:**

```json
{
  "errors": [
    {
      "message": "Token refresh failed: Refresh token expired"
    }
  ]
}
```

**Notes:**

- Call when access token expires (401 error)
- New access token valid for 15 minutes
- If refresh token expires, user must login again

---

## 👤 User Profile APIs

### 3. Get User Profile

**Query:**

```graphql
query {
  userProfile(token: "your_jwt_token") {
    id
    name
    email
    phone
    role
    isActive
    newsletter
    emailVerified
    lastLogin
    createdAt
    updatedAt
  }
}
```

---

### 4. Update User Profile

**Mutation:**

```graphql
mutation {
  updateUserProfile(
    userId: "user_id_123"
    updates: { name: "Jane Doe", phone: "9876543211", newsletter: true }
  ) {
    id
    name
    email
    phone
    newsletter
  }
}
```

---

### 5. Change Password

**Mutation:**

```graphql
mutation {
  changePassword(
    userId: "user_id_123"
    oldPassword: "oldPassword123"
    newPassword: "newPassword456"
  )
}
```

**Response:**

```json
{
  "data": {
    "changePassword": "Password changed successfully"
  }
}
```

---

### 6. Delete User Account

**Mutation:**

```graphql
mutation {
  deleteUserAccount(userId: "user_id_123")
}
```

---

## 📍 Address Management APIs

### 7. Get User Addresses

**Query:**

```graphql
query {
  userAddresses(userId: "user_id_123") {
    id
    userId
    type
    name
    phone
    street
    city
    state
    postalCode
    country
    isDefault
    instructions
  }
}
```

---

### 8. Get Specific Address

**Query:**

```graphql
query {
  userAddress(addressId: "address_id_123", userId: "user_id_123") {
    id
    type
    name
    phone
    street
    city
    state
    postalCode
    country
    isDefault
  }
}
```

---

### 9. Create Address

**Mutation:**

```graphql
mutation {
  createAddress(
    userId: "user_id_123"
    addressData: {
      type: "shipping"
      name: "John Doe"
      phone: "9876543210"
      street: "123 Main St"
      city: "Mumbai"
      state: "Maharashtra"
      postalCode: "400001"
      country: "India"
      isDefault: true
      instructions: "Ring the bell twice"
    }
  ) {
    id
    type
    name
    phone
    street
    city
    state
    postalCode
    country
    isDefault
  }
}
```

---

### 10. Update Address

**Mutation:**

```graphql
mutation {
  updateAddress(
    addressId: "address_id_123"
    userId: "user_id_123"
    updates: { street: "456 New St", city: "Bangalore", isDefault: true }
  ) {
    id
    street
    city
    isDefault
  }
}
```

---

### 11. Delete Address

**Mutation:**

```graphql
mutation {
  deleteAddress(addressId: "address_id_123", userId: "user_id_123")
}
```

---

### 12. Set Default Address

**Mutation:**

```graphql
mutation {
  setDefaultAddress(addressId: "address_id_123", userId: "user_id_123") {
    id
    isDefault
  }
}
```

---

### 13. Get Default Address by Type

**Query:**

```graphql
query {
  defaultAddressByType(userId: "user_id_123", type: "shipping") {
    id
    type
    name
    street
    city
    state
    postalCode
  }
}
```

---

## 🛒 Cart APIs

### 14. Get User Cart

**Query:**

```graphql
query {
  cart(userId: "user_id_123") {
    id
    userId
    items {
      productId
      productName
      productImage
      price
      quantity
      size
      color
    }
    status
  }
}
```

---

### 15. Get Cart Summary

**Query:**

```graphql
query {
  cartSummary(userId: "user_id_123") {
    itemCount
    totalPrice
    items {
      productId
      productName
      price
      quantity
      size
    }
  }
}
```

---

### 16. Add to Cart

**Mutation:**

```graphql
mutation {
  addToCart(
    userId: "user_id_123"
    productId: "product_id_456"
    productData: { name: "T-Shirt", image: "image_url", price: 799.99 }
    quantity: 2
    size: "M"
    color: "Blue"
  ) {
    id
    items {
      productId
      productName
      quantity
      price
    }
  }
}
```

---

### 17. Update Cart Item

**Mutation:**

```graphql
mutation {
  updateCartItem(
    userId: "user_id_123"
    productId: "product_id_456"
    quantity: 3
    size: "M"
  ) {
    items {
      productId
      quantity
    }
  }
}
```

---

### 18. Remove from Cart

**Mutation:**

```graphql
mutation {
  removeFromCart(
    userId: "user_id_123"
    productId: "product_id_456"
    size: "M"
  ) {
    items {
      productId
      productName
    }
  }
}
```

---

### 19. Clear Cart

**Mutation:**

```graphql
mutation {
  clearCart(userId: "user_id_123") {
    items
  }
}
```

---

## 📦 Order APIs

### 20. Create Order

**Mutation:**

```graphql
mutation {
  createOrder(
    userId: "user_id_123"
    orderData: {
      items: [
        {
          productId: "product_id_456"
          productName: "T-Shirt"
          productImage: "image_url"
          price: 799.99
          quantity: 2
          size: "M"
          color: "Blue"
        }
      ]
      shippingAddress: {
        name: "John Doe"
        phone: "9876543210"
        street: "123 Main St"
        city: "Mumbai"
        state: "Maharashtra"
        postalCode: "400001"
        country: "India"
      }
      paymentMethod: "credit_card"
    }
  ) {
    id
    orderNumber
    status
    total
    items {
      productName
      quantity
      price
    }
  }
}
```

---

### 21. Get User Orders

**Query:**

```graphql
query {
  userOrders(userId: "user_id_123", limit: 10, skip: 0) {
    orders {
      id
      orderNumber
      status
      total
      createdAt
    }
    total
    page
    pages
  }
}
```

---

### 22. Get Specific Order

**Query:**

```graphql
query {
  order(orderId: "order_id_123", userId: "user_id_123") {
    id
    orderNumber
    status
    total
    shippingAddress {
      name
      street
      city
      state
    }
    items {
      productName
      quantity
      price
    }
    statusHistory {
      status
      timestamp
      notes
    }
  }
}
```

---

### 23. Track Order

**Query:**

```graphql
query {
  trackOrder(orderId: "order_id_123", userId: "user_id_123") {
    orderNumber
    status
    trackingNumber
    estimatedDelivery
    statusHistory {
      status
      timestamp
    }
  }
}
```

---

### 24. Update Order Status (Admin)

**Mutation:**

```graphql
mutation {
  updateOrderStatus(
    orderId: "order_id_123"
    status: "shipped"
    notes: "Order dispatched from warehouse"
  ) {
    id
    status
    statusHistory {
      status
      timestamp
    }
  }
}
```

---

### 25. Cancel Order

**Mutation:**

```graphql
mutation {
  cancelOrder(
    orderId: "order_id_123"
    userId: "user_id_123"
    reason: "Changed my mind"
  ) {
    id
    status
    cancellationReason
  }
}
```

---

### 26. Get All Orders (Admin)

**Query:**

```graphql
query {
  allOrders(limit: 20, skip: 0) {
    orders {
      id
      orderNumber
      status
      total
      userId
    }
    total
    page
    pages
  }
}
```

---

### 27. Get Order Statistics (Admin)

**Query:**

```graphql
query {
  orderStats {
    totalOrders
    totalRevenue
    ordersByStatus {
      _id
      count
    }
    recentOrders {
      id
      orderNumber
      status
      total
    }
  }
}
```

---

## ⭐ Review APIs

### 28. Create Review

**Mutation:**

```graphql
mutation {
  createReview(
    productId: "product_id_456"
    userId: "user_id_123"
    reviewData: {
      rating: 5
      title: "Excellent Product!"
      comment: "Great quality and fast shipping"
      images: ["image_url_1", "image_url_2"]
    }
  ) {
    id
    rating
    title
    comment
    status
  }
}
```

---

### 29. Get Product Reviews

**Query:**

```graphql
query {
  productReviews(
    productId: "product_id_456"
    limit: 10
    skip: 0
    sortBy: "recent"
  ) {
    reviews {
      id
      rating
      title
      comment
      helpful
      unhelpful
    }
    total
    stats {
      avgRating
      totalReviews
    }
  }
}
```

---

### 30. Get Specific Review

**Query:**

```graphql
query {
  review(reviewId: "review_id_789") {
    id
    rating
    title
    comment
    helpful
    unhelpful
  }
}
```

---

### 31. Update Review

**Mutation:**

```graphql
mutation {
  updateReview(
    reviewId: "review_id_789"
    userId: "user_id_123"
    updates: { rating: 4, comment: "Good product, but shipping took time" }
  ) {
    id
    rating
    comment
  }
}
```

---

### 32. Delete Review

**Mutation:**

```graphql
mutation {
  deleteReview(reviewId: "review_id_789", userId: "user_id_123")
}
```

---

### 33. Mark Review as Helpful

**Mutation:**

```graphql
mutation {
  markReviewHelpful(reviewId: "review_id_789") {
    id
    helpful
  }
}
```

---

### 34. Get Pending Reviews (Admin)

**Query:**

```graphql
query {
  pendingReviews(limit: 20, skip: 0) {
    reviews {
      id
      productId
      rating
      title
      comment
      status
    }
    total
  }
}
```

---

### 35. Approve Review (Admin)

**Mutation:**

```graphql
mutation {
  approveReview(reviewId: "review_id_789") {
    id
    status
  }
}
```

---

## ❤️ Wishlist APIs

### 36. Get User Wishlist

**Query:**

```graphql
query {
  userWishlist(userId: "user_id_123") {
    id
    items {
      productId
      productName
      productImage
      price
      addedAt
    }
  }
}
```

---

### 37. Add to Wishlist

**Mutation:**

```graphql
mutation {
  addToWishlist(
    userId: "user_id_123"
    productId: "product_id_456"
    productData: { name: "T-Shirt", image: "image_url", price: 799.99 }
  ) {
    id
    items {
      productId
      productName
      price
    }
  }
}
```

---

### 38. Remove from Wishlist

**Mutation:**

```graphql
mutation {
  removeFromWishlist(userId: "user_id_123", productId: "product_id_456") {
    items {
      productId
      productName
    }
  }
}
```

---

### 39. Get Wishlist Count

**Query:**

```graphql
query {
  wishlistCount(userId: "user_id_123")
}
```

---

### 40. Check if Product in Wishlist

**Query:**

```graphql
query {
  isInWishlist(userId: "user_id_123", productId: "product_id_456")
}
```

---

## 📧 Newsletter APIs

### 41. Subscribe to Newsletter

**Mutation:**

```graphql
mutation {
  subscribeNewsletter(email: "user@example.com")
}
```

---

## 🛍️ Product APIs (Existing)

### 42. Get All Products

**Query:**

```graphql
query {
  shopProducts(limit: 20, skip: 0) {
    id
    name
    price
    image
    brand
    category
    rate
  }
}
```

---

### 43. Search Products

**Query:**

```graphql
query {
  searchProducts(keyword: "shirt") {
    id
    name
    price
    image
    brand
  }
}
```

---

### 44. Get Product Details

**Query:**

```graphql
query {
  product(id: "product_id_456") {
    id
    name
    price
    image
    brand
    category
    shortDescription
    longDescription
  }
}
```

---

## 🔒 Authentication

All protected mutations and queries require a valid JWT token. Pass the token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Or use the token from the login/register response.

---

## ⚠️ Error Handling

All API responses include error handling. Example error response:

```json
{
  "errors": [
    {
      "message": "User not found",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

---

## 📊 Status Codes

- **200 OK**: Successful request
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Missing or invalid authentication
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## 🔑 Enum Values

### Order Status

- `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`

### Payment Status

- `pending`, `completed`, `failed`, `refunded`

### Review Status

- `pending`, `approved`, `rejected`

### Address Type

- `billing`, `shipping`

### Payment Methods

- `credit_card`, `debit_card`, `upi`, `net_banking`, `wallet`

---

## 📝 Rate Limiting

No rate limit currently implemented. In production, consider implementing:

- 100 requests per minute per user
- 1000 requests per minute per IP

---

## 🚀 Usage Tips

1. **Always validate input** before sending to API
2. **Use pagination** for list queries (limit + skip)
3. **Store JWT token securely** in localStorage or cookie
4. **Handle errors gracefully** in your frontend
5. **Use proper sorting** for reviews (recent, rating-high, helpful)

---

**API Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready
