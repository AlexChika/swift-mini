import { Types } from "mongoose";
import { GraphQLError } from "graphql";
import userModel from "@src/models/user.model";
import { ApiReturn, GraphqlContext, User } from "swift-mini";

type CreateUsernameResponse = ApiReturn<string, "username">;

type SearchUserResponse = ApiReturn<User<Types.ObjectId>[], "users">;

const resolvers = {
  Query: {
    searchUsers: async (
      _: unknown,
      args: { username: string },
      ctx: GraphqlContext
    ): Promise<SearchUserResponse> => {
      const { username: searchedUsername } = args;
      const { session } = ctx;

      if (!session?.user)
        return {
          success: false,
          msg: "User is not authenticated"
        };

      const { username: myUsername } = session.user;

      try {
        const users = await userModel.find({
          username: {
            $regex: searchedUsername,
            $options: "i",
            $ne: myUsername
          }
        });

        return {
          success: true,
          msg: "success",
          users
        };
      } catch (error) {
        const e = error as unknown as { message: string };
        console.log(e.message || e, "searchUsers error");
        throw new GraphQLError(e?.message || "Something went wrong");
      }
    },

    getRecentRandomUsers: async (
      _: unknown,
      args: { count?: number },
      ctx: GraphqlContext
    ) => {
      const { session } = ctx;

      if (!session?.user?.id)
        return {
          success: false,
          msg: "User is not authenticated"
        };

      const count = Math.min(Math.max(args.count ?? 30, 1), 100);

      try {
        const users = await userModel.aggregate([
          // Exclude the current user
          {
            $match: {
              _id: { $ne: new Types.ObjectId(session.user.id) }
            }
          },

          // Add recency weight (based on updatedAt proximity to "now")
          {
            $addFields: {
              recencyWeight: {
                $divide: [
                  { $subtract: [new Date(), "$updatedAt"] },
                  1000 * 60 * 60 * 24 * 30 // normalize by ~30 days range
                ]
              }
            }
          },

          {
            // Convert to a 0–1 range: newer = closer to 1
            $addFields: {
              recencyScore: {
                $max: [{ $subtract: [1, "$recencyWeight"] }, 0]
              }
            }
          },
          {
            // Add randomness biased by recencyScore
            $addFields: {
              randomWeighted: {
                $multiply: ["$recencyScore", { $rand: {} }]
              }
            }
          },
          { $sort: { randomWeighted: -1 } },
          { $limit: count },
          {
            $project: {
              id: { $toString: "$_id" },
              username: 1,
              name: 1,
              image: 1,
              permanentImageUrl: 1
            }
          }
        ]);

        return {
          success: true,
          msg: "success",
          users
        };
      } catch (err) {
        const e = err as { message?: string };
        console.error("getRecentRandomUsers error:", e?.message ?? err);
        throw new GraphQLError(e?.message ?? "Something went wrong");
      }
    }
  },

  Mutation: {
    createUsername: async (
      _: unknown,
      args: { username: string },
      ctx: GraphqlContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { session } = ctx;

      if (!session?.user)
        return {
          success: false,
          msg: "User unauthenticated"
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
        if (existingUser)
          return {
            success: false,
            msg: "Username is taken"
          };

        // update user
        await userModel.findByIdAndUpdate(userId, { username }).exec();

        return {
          username,
          success: true,
          msg: "success"
        };
      } catch (error) {
        const e = error as unknown as { message: string };
        console.log(e.message || e, "createUsername error");
        throw new GraphQLError(e?.message || "Something went wrong");
      }
    }
  }

  // Subscription: {},
};

export default resolvers;
