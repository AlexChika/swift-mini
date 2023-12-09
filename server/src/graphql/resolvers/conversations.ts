import { GraphQLError } from "graphql";
import { GraphqlContext } from "../../../lib/swift-mini";
import { Prisma } from "@prisma/client";

const conversationResolver = {
  Query: {},
  Mutation: {
    createConversation(
      _: any,
      args: { participantIds: string[] },
      ctx: GraphqlContext
    ) {
      const { prisma, session } = ctx;
      const { participantIds } = args;
      const { id: userId } = session.user;

      if (!session?.user) throw new GraphQLError("User is not authenticated");

      try {
        const conversation = prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => {
                  return {
                    userId: id,
                    hasSeenLatestMessage: id === userId,
                  };
                }),
              },
            },
          },

          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
            latestMessage: {
              include: {
                sender: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        });
      } catch (error) {
        console.log("createConversation error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  // Subscription: {},
};

export const conversationsPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({});
export default conversationResolver;
