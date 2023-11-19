import { GraphqlContext } from "../../../lib/swift-mini";

const resolvers = {
  Query: {
    searchUsers() {},
  },
  Mutation: {
    createUsername(_: any, args: { username: string }, ctx: GraphqlContext) {
      const { username } = args;
      const { session, prisma } = ctx;
    },
  },
  // Subscription: {},
};

export default resolvers;
