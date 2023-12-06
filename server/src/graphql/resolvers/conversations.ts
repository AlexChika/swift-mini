// import { GraphQLError } from "graphql";
import { GraphqlContext } from "../../../lib/swift-mini";

const conversationResolver = {
  Query: {},
  Mutation: {
    createConversation(
      _: any,
      args: { participantIds: string[] },
      ctx: GraphqlContext
    ) {
      const { prisma, session } = ctx;
      const participantIds = args.participantIds;

      console.log({ participantIds, session });
    },
  },
  // Subscription: {},
};

export default conversationResolver;
