import { GraphQLError } from "graphql";
import {
  CreateUsernameResponse,
  GraphqlContext,
} from "../../../lib/swift-mini";
import { User } from "@prisma/client";

const resolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: { username: string },
      ctx: GraphqlContext
    ): Promise<User[]> => {
      const { username: searchedUsername } = args;
      const { session, prisma } = ctx;

      if (!session?.user) throw new GraphQLError("User is not authenticated");

      const { username: myUsername } = session.user;

      try {
        const users = prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: myUsername,
              mode: "insensitive",
            },
          },
        });

        return users;
      } catch (error) {
        console.log("searchUsers error", error);
        throw new GraphQLError(error?.message);
      }
    },
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
