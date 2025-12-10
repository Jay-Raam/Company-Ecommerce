import { createSchema } from "graphql-yoga";
import { productTypeDefs } from "./schema.js";
import { productResolvers } from "./resolvers.js";

export const schema = createSchema({
  typeDefs: [productTypeDefs],
  resolvers: [productResolvers],
});
