import { GraphQLError } from "graphql";
import { GraphqlContext, User } from "swift-mini";
import userModel from "@src/models/user.model";
import { createPermanentUrl } from "@lib/utils";

type CreateUsernameResponse = {
  success: boolean;
  error?: string;
  username: string;
};

type Args = {
  username: string;
  userHasImage: boolean;
};

const resolvers = {
  Query: {
    searchUsers: async (
      _: unknown,
      args: { username: string },
      ctx: GraphqlContext
    ): Promise<User[]> => {
      const { username: searchedUsername } = args;
      const { session } = ctx;

      if (!session?.user) throw new GraphQLError("User is not authenticated");

      const { username: myUsername } = session.user;

      try {
        const users = await userModel.find({
          username: {
            $regex: searchedUsername,
            $options: "i",
            $ne: myUsername
          }
        });

        return users;
      } catch (error) {
        const e = error as unknown as { message: string };
        console.log("searchUsers error", error);
        throw new GraphQLError(e?.message);
      }
    }
  },

  Mutation: {
    createUsername: async (
      _: unknown,
      args: Args,
      ctx: GraphqlContext
    ): Promise<CreateUsernameResponse> => {
      const { username, userHasImage } = args;
      const { session } = ctx;

      if (!session?.user)
        return {
          username,
          success: false,
          error: "User unauthenticated"
        };

      const { id: userId } = session.user;

      try {
        // check uniqueness of username
        const existingUser = await userModel
          .findOne({
            username
          })
          .exec();

        // user exists
        if (existingUser) {
          return {
            username,
            success: false,
            error: "Username is taken"
          };
        }

        // update user
        await userModel
          .findByIdAndUpdate(userId, {
            username,
            permanentImageUrl: userHasImage
              ? createPermanentUrl(userId)
              : undefined
          })
          .exec();

        return {
          username,
          success: true,
          error: undefined
        };
      } catch (error) {
        console.log("createUsername error", error);
        const e = error as unknown as { message: string };
        return {
          username,
          success: false,
          error: e?.message
        };
      }
    }
  }

  // Subscription: {},
};

export default resolvers;
