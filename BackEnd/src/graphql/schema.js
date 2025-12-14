export const productTypeDefs = /* GraphQL */ `
  scalar JSON

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
    stockAvailabilityInformation: String
    priceInformation: String
    contextualInformation: String
    merchantProductOfferId: String
    merchantId: String
    normalizedCategoryPath: String
    popularityInformation: JSON
    createdAt: String
    updatedAt: String
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
    stockAvailabilityInformation: String
    priceInformation: String
    contextualInformation: String
    merchantProductOfferId: String
    merchantId: String
    normalizedCategoryPath: String
    popularityInformation: JSON
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
    tax : Float

    gtin: String
    sku: String

    originalWebpageUrl: String
    processedWebpageUrl: String
    mainImageUrls: JSON

    localeCode: String
    shortDescription: String
    longDescription: String

    stockAvailabilityInformation: String
    priceInformation: JSON
    contextualInformation: JSON

    merchantProductOfferId: String
    merchantId: String

    popularityInformation: JSON
  }

  type ShopMeta {
    categories: [String]
    minPrice: Float
    maxPrice: Float
  }

  type Query {
    products(limit: Int = 20, skip: Int = 0): [ShopProduct]
    product(id: ID!): ShopProduct
    searchProducts(keyword: String!): [ShopProduct]

    shopProducts(limit: Int = 20, skip: Int = 0, filter: JSON): [ShopProduct]

    BrandProductsShop(
      brand: String!
      limit: Int = 20
      skip: Int = 0
      filter: JSON
    ): [ShopProduct]

    shopMeta: ShopMeta
  }

  type Mutation {
    addProduct(product: ProductInput!): Product
    updateProduct(id: ID!, product: ProductInput!): Product
    deleteProduct(id: ID!): String
  }
`;
