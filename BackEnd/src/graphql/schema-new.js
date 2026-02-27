export const allTypeDefs = /* GraphQL */ `
  scalar JSON

  # ============ PRODUCT TYPES ============
  type Product {
    _id: ID!
    gtin: String
    sku: String
    originalWebpageUrl: String
    processedWebpageUrl: String
    mainImageUrls: String
    localeCode: String
    originalTitle: String
    shortDescription: String
    longDescription: String
    stockAvailabilityInformation: JSON
    priceInformation: JSON
    contextualInformation: JSON
    merchantProductOfferId: JSON
    merchantId: String
    normalizedCategoryPath: String
    popularityInformation: JSON
    createdAt: String
    updatedAt: String
  }

  type ShopProduct {
    id: ID!
    name: String!
    bestseller: Boolean
    rate: String
    price: Float
    image: String
    brand: String
    category: String
    size: String
    tax: Float
    gtin: String
    sku: String
    originalWebpageUrl: String
    processedWebpageUrl: String
    mainImageUrls: JSON
    localeCode: String
    shortDescription: String
    longDescription: String
    stockAvailabilityInformation: JSON
    priceInformation: JSON
    contextualInformation: JSON
    merchantProductOfferId: JSON
    merchantId: String
    popularityInformation: JSON
  }

  type ShopMeta {
    categories: [String]
    minPrice: Float
    maxPrice: Float
  }

  input ProductInput {
    gtin: String
    sku: String
    originalWebpageUrl: String
    processedWebpageUrl: String
    mainImageUrls: String
    localeCode: String
    originalTitle: String
    shortDescription: String
    longDescription: String
    stockAvailabilityInformation: JSON
    priceInformation: String
    contextualInformation: JSON
    merchantProductOfferId: String
    merchantId: String
    normalizedCategoryPath: String
    popularityInformation: JSON
  }

  # ============ USER TYPES ============
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String
    role: String!
    isActive: Boolean!
    newsletter: Boolean
    emailVerified: Boolean
    lastLogin: String
    createdAt: String!
    updatedAt: String!
  }

  type AuthResponse {
    id: ID!
    name: String!
    email: String!
    phone: String
    role: String!
    accessToken: String
    refreshToken: String
    expiresIn: Int
  }

  type RefreshTokenResponse {
    accessToken: String!
    expiresIn: Int!
  }

  input UserUpdateInput {
    name: String
    phone: String
    newsletter: Boolean
  }

  # ============ ADDRESS TYPES ============
  type Address {
    id: ID!
    userId: ID!
    type: String!
    name: String!
    phone: String!
    street: String!
    city: String!
    state: String!
    postalCode: String!
    country: String!
    isDefault: Boolean!
    instructions: String
    createdAt: String!
    updatedAt: String!
  }

  input AddressInput {
    type: String!
    name: String!
    phone: String!
    street: String!
    city: String!
    state: String!
    postalCode: String!
    country: String
    isDefault: Boolean
    instructions: String
  }

  input AddressUpdateInput {
    name: String
    phone: String
    street: String
    city: String
    state: String
    postalCode: String
    country: String
    isDefault: Boolean
    instructions: String
  }

  # ============ CART TYPES ============
  type CartItem {
    productId: ID!
    productName: String!
    productImage: String
    price: Float!
    quantity: Int!
    size: String
    color: String
  }

  type Cart {
    id: ID!
    userId: ID!
    items: [CartItem!]!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type CartSummary {
    itemCount: Int!
    totalPrice: Float!
    items: [CartItem!]!
  }

  input CartItemInput {
    productId: ID!
    productName: String!
    productImage: String
    price: Float!
    quantity: Int!
    size: String
    color: String
  }

  input ProductDataInput {
    name: String!
    image: String
    price: Float!
  }

  # ============ ORDER TYPES ============
  type OrderItem {
    productId: ID
    productName: String
    productImage: String
    price: Float
    quantity: Int
    size: String
    color: String
  }

  type AddressData {
    name: String
    phone: String
    street: String
    city: String
    state: String
    postalCode: String
    country: String
  }

  type OrderStatusHistory {
    status: String!
    timestamp: String!
    notes: String
  }

  type Order {
    id: ID!
    orderNumber: String!
    userId: ID!
    shippingAddress: AddressData
    billingAddress: AddressData
    items: [OrderItem!]!
    subtotal: Float!
    tax: Float!
    shippingCost: Float!
    discount: Float
    couponCode: String
    total: Float!
    paymentMethod: String!
    paymentStatus: String!
    transactionId: String
    status: String!
    trackingNumber: String
    estimatedDelivery: String
    actualDelivery: String
    specialInstructions: String
    cancellationReason: String
    statusHistory: [OrderStatusHistory!]!
    createdAt: String!
    updatedAt: String!
  }

  type OrdersResponse {
    orders: [Order!]!
    total: Int!
    page: Int!
    pages: Int!
  }

  type TrackingInfo {
    orderNumber: String!
    status: String!
    trackingNumber: String
    estimatedDelivery: String
    statusHistory: [OrderStatusHistory!]!
  }

  type OrderStats {
    totalOrders: Int!
    totalRevenue: Float!
    ordersByStatus: [JSON!]!
    recentOrders: [Order!]!
  }

  input OrderItemInput {
    productId: ID
    productName: String
    productImage: String
    price: Float
    quantity: Int
    size: String
    color: String
  }

  input AddressDataInput {
    name: String!
    phone: String!
    street: String!
    city: String!
    state: String!
    postalCode: String!
    country: String!
  }

  input OrderInput {
    items: [OrderItemInput!]!
    shippingAddress: AddressDataInput!
    billingAddress: AddressDataInput
    paymentMethod: String!
  }

  # ============ REVIEW TYPES ============
  type Review {
    id: ID!
    productId: ID!
    userId: ID!
    rating: Int!
    title: String!
    comment: String!
    verifiedPurchase: Boolean!
    helpful: Int
    unhelpful: Int
    status: String!
    images: [String!]
    createdAt: String!
    updatedAt: String!
  }

  type ReviewStats {
    avgRating: Float
    totalReviews: Int
  }

  type ReviewsResponse {
    reviews: [Review!]!
    total: Int!
    stats: ReviewStats!
  }

  type PendingReviewsResponse {
    reviews: [Review!]!
    total: Int!
  }

  input ReviewInput {
    rating: Int!
    title: String!
    comment: String!
    images: [String!]
  }

  input ReviewUpdateInput {
    rating: Int
    title: String
    comment: String
    images: [String!]
  }

  # ============ WISHLIST TYPES ============
  type WishlistItem {
    productId: ID!
    productName: String!
    productImage: String
    price: Float!
    addedAt: String!
  }

  type Wishlist {
    id: ID!
    userId: ID!
    items: [WishlistItem!]!
    createdAt: String!
    updatedAt: String!
  }

  type MoveToCartResponse {
    movedItems: [WishlistItem!]!
    wishlist: Wishlist!
  }

  # ============ QUERIES ============
  type Query {
    # Products
    products(limit: Int, skip: Int): [ShopProduct!]!
    product(id: ID!): ShopProduct
    searchProducts(keyword: String!): [ShopProduct!]!
    shopProducts(limit: Int, skip: Int, filter: JSON): [ShopProduct!]!
    BrandProductsShop(
      brand: String!
      limit: Int
      skip: Int
      filter: JSON
    ): [ShopProduct!]!
    shopMeta: ShopMeta!

    # User
    userProfile(token: String!): User
    me: User

    # Addresses
    userAddresses(userId: ID!): [Address!]!
    userAddress(addressId: ID!, userId: ID!): Address
    defaultAddressByType(userId: ID!, type: String!): Address

    # Cart
    cart(userId: ID!): Cart
    cartSummary(userId: ID!): CartSummary

    # Orders
    userOrders(userId: ID!, limit: Int, skip: Int): OrdersResponse
    order(orderId: ID!, userId: ID!): Order
    trackOrder(orderId: ID!, userId: ID!): TrackingInfo
    allOrders(limit: Int, skip: Int, filter: JSON): OrdersResponse
    orderStats: OrderStats

    # Reviews
    productReviews(
      productId: ID!
      limit: Int
      skip: Int
      sortBy: String
    ): ReviewsResponse
    review(reviewId: ID!): Review
    pendingReviews(limit: Int, skip: Int): PendingReviewsResponse

    # Wishlist
    userWishlist(userId: ID!): Wishlist
    wishlistCount(userId: ID!): Int!
    isInWishlist(userId: ID!, productId: ID!): Boolean!
  }

  # ============ MUTATIONS ============
  type Mutation {
    # Products
    addProduct(product: ProductInput!): ShopProduct
    updateProduct(id: ID!, product: ProductInput!): ShopProduct
    deleteProduct(id: ID!): String!

    # Newsletter
    subscribeNewsletter(email: String!): String!

    # User Authentication
    registerUser(
      name: String!
      email: String!
      password: String!
      phone: String
    ): AuthResponse!
    loginUser(email: String!, password: String!): AuthResponse!
    logout: String!
    refreshAccessToken(refreshToken: String!): RefreshTokenResponse!
    updateUserProfile(userId: ID!, updates: UserUpdateInput!): User!
    changePassword(
      userId: ID!
      oldPassword: String!
      newPassword: String!
    ): String!
    deleteUserAccount(userId: ID!): String!

    # Addresses
    createAddress(userId: ID!, addressData: AddressInput!): Address!
    updateAddress(
      addressId: ID!
      userId: ID!
      updates: AddressUpdateInput!
    ): Address!
    deleteAddress(addressId: ID!, userId: ID!): String!
    setDefaultAddress(addressId: ID!, userId: ID!): Address!

    # Cart
    addToCart(
      userId: ID!
      productId: ID!
      productData: ProductDataInput!
      quantity: Int
      size: String
      color: String
    ): Cart!
    mergeCart(userId: ID!, items: [CartItemInput!]!): Cart!
    updateCartItem(
      userId: ID!
      productId: ID!
      quantity: Int!
      size: String
    ): Cart!
    removeFromCart(userId: ID!, productId: ID!, size: String): Cart!
    clearCart(userId: ID!): Cart!

    # Orders
    createOrder(userId: ID!, orderData: OrderInput!): Order!
    updateOrderStatus(orderId: ID!, status: String!, notes: String): Order!
    cancelOrder(orderId: ID!, userId: ID!, reason: String): Order!

    # Reviews
    createReview(productId: ID!, userId: ID!, reviewData: ReviewInput!): Review!
    updateReview(
      reviewId: ID!
      userId: ID!
      updates: ReviewUpdateInput!
    ): Review!
    deleteReview(reviewId: ID!, userId: ID!): String!
    markReviewHelpful(reviewId: ID!): Review!
    markReviewUnhelpful(reviewId: ID!): Review!
    approveReview(reviewId: ID!): Review!
    rejectReview(reviewId: ID!): Review!

    # Wishlist
    addToWishlist(
      userId: ID!
      productId: ID!
      productData: ProductDataInput!
    ): Wishlist!
    removeFromWishlist(userId: ID!, productId: ID!): Wishlist!
    clearWishlist(userId: ID!): Wishlist!
    moveWishlistToCart(userId: ID!, productIds: [ID!]!): MoveToCartResponse!
  }
`;
