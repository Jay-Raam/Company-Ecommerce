export const productTypeDefs = /* GraphQL */ `
  type Product {
    _id: ID!
    productId: Int!
    productPosition: String
    promotion: String
    productCategory: String
    seasonal: String
    salesVolume: Int
    brand: String
    url: String
    name: String!
    description: String
    price: Float
    currency: String
    terms: String
    section: String
    season: String
    material: String
    origin: String
    createdAt: String
    updatedAt: String
  }

  input ProductInput {
    productId: Int!
    productPosition: String
    promotion: String
    productCategory: String
    seasonal: String
    salesVolume: Int
    brand: String
    url: String
    name: String!
    description: String
    price: Float
    currency: String
    terms: String
    section: String
    season: String
    material: String
    origin: String
  }

  type Query {
    products(limit: Int = 20, skip: Int = 0): [Product]
    product(id: ID!): Product
    productByProductId(productId: Int!): Product
    searchProducts(keyword: String!): [Product]
  }

  type Mutation {
    addProduct(product: ProductInput!): Product
    updateProduct(id: ID!, product: ProductInput!): Product
    deleteProduct(id: ID!): String
  }
`;
