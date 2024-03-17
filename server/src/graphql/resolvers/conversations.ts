import { GraphQLError, subscribe } from "graphql";
import { GraphqlContext } from "../../../swift-mini";
import { Prisma } from "@prisma/client";
import { dateScalar } from "./scalers";

const conversationResolver = {
  Date: dateScalar,
  Query: {
    conversations: async (_: any, __: any, ctx: GraphqlContext) => {
      const { session, prisma } = ctx;
      console.log("I was hit again");

      if (!session?.user.username) {
        throw new GraphQLError("User is not authenticated");
      }

      const { id } = session.user;

      try {
        const convos = await prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userId: {
                  equals: id,
                },
              },
            },
          },

          include: conversationsPopulated,
        });
        console.log({ participants: convos[0].participants, convos });
        return convos;
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
      const { prisma, session, pubsub } = ctx;
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

        // emit create subscription event
        pubsub.publish("CONVERSATION_CREATED", {
          conversationCreated: conversation,
        });

        return { conversationId: conversation.id };
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("createConversation error", error);
        throw new GraphQLError(err.message);
      }
    },
  },
  Subscription: {
    conversationCreated: {
      subscribe(_: any, __: any, ctx: GraphqlContext) {
        const { pubsub } = ctx;
        return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
      },
    },
  },
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
      select: {
        hasSeenLatestMessage: true,
        conversationId: true,
        userId: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      // include: participantsPopulated,
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
