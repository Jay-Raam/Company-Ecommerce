import { createSchema } from "graphql-yoga";
import { allTypeDefs } from "./schema-new.js";
import { productResolvers } from "./resolvers-new.js";

export const schema = createSchema({
  typeDefs: allTypeDefs,
  resolvers: productResolvers,
});
