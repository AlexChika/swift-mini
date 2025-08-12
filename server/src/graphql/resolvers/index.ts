// import merge from "lodash.merge";
// import userResolvers from "./user";

import userResolver from "./user.resolver";
import conversationResolver from "./conversations";
import messageResolver from "./message";
import { merge } from "lib";

const resolvers = merge(
  {},
  conversationResolver,
  userResolver,
  messageResolver
);

export default resolvers;
