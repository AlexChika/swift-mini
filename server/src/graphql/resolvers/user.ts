import { GraphqlContext } from "../../../lib/swift-mini";

const resolvers = {
  Query: {
    searchUsers() {},
  },
  Mutation: {
    createUsername(_: any, args: { username: string }, ctx: GraphqlContext) {
      console.log(ctx.session.user.username);
    },
  },
  // Subscription: {},
};

export default resolvers;
