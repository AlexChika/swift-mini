import {
  CreateUsernameResponse,
  GraphqlContext,
} from "../../../lib/swift-mini";

const resolvers = {
  Query: {
    searchUsers() {},
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      ctx: GraphqlContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { session, prisma } = ctx;

      if (!session.user)
        return {
          username,
          success: false,
          error: "User unauthenticated",
        };

      const id = session.user.id;
      try {
        // check uniqueness of username
      } catch (error) {
        console.log("createUsername error", error);
        return {
          username,
          success: false,
          error: error.message,
        };
      }
    },
  },
  // Subscription: {},
};

export default resolvers;
