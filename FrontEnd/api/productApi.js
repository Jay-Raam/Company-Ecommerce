const GRAPHQL_URL = "http://localhost:4000/graphql";

// Helper function to send GraphQL queries
async function request(query, variables = {}) {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

// ========================
// GET ALL PRODUCTS
// ========================

export const fetchShopProducts = async (limit = 20, skip = 0) => {
  const query = `
    query ($limit: Int, $skip: Int) {
      shopProducts(limit: $limit, skip: $skip) {
        id
        name
        price
        image
        brand
        category
        size

          tax 

         rate

        gtin
        sku
        

        originalWebpageUrl
        processedWebpageUrl
        mainImageUrls

        localeCode
        shortDescription
        longDescription

        stockAvailabilityInformation
        priceInformation
        contextualInformation

        merchantProductOfferId
        merchantId

        popularityInformation
      }
    }
  `;

  return request(query, { limit, skip });
};

export const fetchBrandProductsShop = async (brand, limit = 20, skip = 0) => {
  const query = `
    query ($brand: String!, $limit: Int, $skip: Int) {
      BrandProductsShop(
        brand: $brand
        limit: $limit
        skip: $skip
      ) {
        id
        name
        price
        image
        brand
        bestseller
        category
        size
        rate

          tax 

        gtin
        sku

        originalWebpageUrl
        processedWebpageUrl
        mainImageUrls

        localeCode
        shortDescription
        longDescription

        stockAvailabilityInformation
        priceInformation
        contextualInformation

        merchantProductOfferId
        merchantId

        popularityInformation
      }
    }
  `;

  return request(query, { brand, limit, skip });
};

export const fetchShopMeta = async () => {
  const query = `
    query {
      shopMeta {
        categories
        minPrice
        maxPrice
      }
    }
  `;

  return request(query);
};

// ========================
// GET PRODUCT BY _id
// ========================
export const fetchShopProductById = async (id) => {
  const query = `
    query ($id: ID!) {
      product(id: $id) {
        id
        name
        price
        image
        brand
        bestseller
        rate
        category
        size

          tax

        gtin
        sku

        originalWebpageUrl
        processedWebpageUrl
        mainImageUrls

        localeCode
        shortDescription
        longDescription

        stockAvailabilityInformation
        priceInformation
        contextualInformation

        merchantProductOfferId
        merchantId

        popularityInformation
      }
    }
  `;

  return request(query, { id });
};

// ========================
// SEARCH PRODUCTS
// ========================
export const searchProductsApi = async (keyword) => {
  const query = `
    query ($keyword: String!) {
      searchProducts(keyword: $keyword) {
        _id
        name
        brand
        price
      }
    }
  `;
  return request(query, { keyword });
};

// ========================
// ADD NEW PRODUCT
// ========================
export const createProduct = async (product) => {
  const mutation = `
    mutation ($product: ProductInput!) {
      addProduct(product: $product) {
        _id
        productId
        name
      }
    }
  `;
  return request(mutation, { product });
};

// ========================
// UPDATE PRODUCT
// ========================
export const updateProductApi = async (id, product) => {
  const mutation = `
    mutation ($id: ID!, $product: ProductInput!) {
      updateProduct(id: $id, product: $product) {
        _id
        name
        price
      }
    }
  `;
  return request(mutation, { id, product });
};

// ========================
// DELETE PRODUCT
// ========================
export const deleteProductApi = async (id) => {
  const mutation = `
    mutation ($id: ID!) {
      deleteProduct(id: $id)
    }
  `;
  return request(mutation, { id });
};
