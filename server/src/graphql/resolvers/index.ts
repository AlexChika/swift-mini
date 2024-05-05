// import merge from "lodash.merge";
import userResolvers from "./user";
import conversationResolver from "./conversations";
import messageResolver from "./message";
import { merge } from "#lib";

const resolvers = merge(
  {},
  conversationResolver,
  userResolvers,
  messageResolver
);

export default resolvers;
