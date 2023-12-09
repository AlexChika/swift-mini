import { GraphQLError } from "graphql";
import { GraphqlContext } from "../../../lib/swift-mini";
import { Prisma } from "@prisma/client";

const conversationResolver = {
  Query: {},
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: string[] },
      ctx: GraphqlContext
    ): Promise<{ conversationId: string }> => {
      const { prisma, session } = ctx;
      const { participantIds } = args;
      const { id: userId } = session.user;

      if (!session?.user) throw new GraphQLError("User is not authenticated");

      try {
        const conversation = await prisma.conversation.create({
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

          include: conversationsPopulated,
        });

        return { conversationId: conversation.id };
      } catch (error) {
        console.log("createConversation error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  // Subscription: {},
};

export const participantsPopulated =
  Prisma.validator<Prisma.ConversationParticipantsInclude>()({
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });
export const conversationsPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantsPopulated,
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
  });
export default conversationResolver;
