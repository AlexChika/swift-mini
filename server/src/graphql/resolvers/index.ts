// import merge from "lodash.merge";
// import userResolvers from "./user";

import { merge } from "@lib/utils";
import messageResolver from "./message";
import userResolver from "./user.resolver";
import conversationResolver from "./conversations";

const resolvers = merge(
  {},
  conversationResolver,
  userResolver,
  messageResolver
);

export default resolvers;
