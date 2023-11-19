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

      if (!session?.user)
        return {
          username,
          success: false,
          error: "User unauthenticated",
        };

      const { id: userId } = session.user;
      console.log({ userId });
      try {
        // check uniqueness of username
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (existingUser) {
          return {
            username,
            success: false,
            error: "Username is taken",
          };
        }

        // update user
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });

        return {
          username,
          success: true,
        };
      } catch (error) {
        console.log("createUsername error", error);
        return {
          username,
          success: false,
          error: error?.message,
        };
      }
    },
  },
  // Subscription: {},
};

export default resolvers;
