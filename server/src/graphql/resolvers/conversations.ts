import { GraphQLError } from "graphql";
import { GraphqlContext } from "../../../lib/swift-mini";

const conversationResolver = {
  Query: {},
  Mutation: {
    createConversation() {
      console.log("first");
    },
  },
  // Subscription: {},
};

export default conversationResolver;
