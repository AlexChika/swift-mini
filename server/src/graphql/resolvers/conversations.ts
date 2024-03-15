import { GraphQLError } from "graphql";
import { GraphqlContext } from "../../../swift-mini";
import { Prisma } from "@prisma/client";
import { dateScalar } from "./scalers";

const conversationResolver = {
  Date: dateScalar,
  Query: {
    conversations: async (_: any, __: any, ctx: GraphqlContext) => {
      const { session, prisma } = ctx;

      if (!session?.user.username) {
        throw new GraphQLError("User is not authenticated");
      }

      const { id } = session.user;

      try {
        const convos = await prisma.conversation.findMany({
          where: {
            participants: {
              every: {
                userId: {
                  equals: id,
                },
              },
            },
          },

          include: conversationsPopulated,
        });
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("Conversation error", error);
        throw new GraphQLError(err.message);
      }
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: string[] },
      ctx: GraphqlContext
    ): Promise<{ conversationId: string }> => {
      const { prisma, session } = ctx;
      const { participantIds } = args;

      if (!session?.user) throw new GraphQLError("User is not authenticated");

      const { id: userId } = session.user;

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

        // emit

        return { conversationId: conversation.id };
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("createConversation error", error);
        throw new GraphQLError(err.message);
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
