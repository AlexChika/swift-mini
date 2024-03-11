// import merge from "lodash.merge";
import userResolvers from "./user";
import conversationResolver from "./conversations";
import { merge } from "#lib/index";

const resolvers = merge({}, conversationResolver, userResolvers);

export default resolvers;
