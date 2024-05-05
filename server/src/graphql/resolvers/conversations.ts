import { GraphQLError } from "graphql";
import { Conversation, GraphqlContext } from "../../../swift-mini";
import { Prisma } from "@prisma/client";
import { dateScalar } from "./scalers";
import { withFilter } from "graphql-subscriptions";

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
              some: {
                userId: {
                  equals: id,
                },
              },
            },
          },

          include: conversationsInclude,
        });
        console.log({ part: convos[3].participants });
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

          include: conversationsInclude,
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
      subscribe: withFilter(
        (_: any, __: any, ctx: GraphqlContext) => {
          const { pubsub } = ctx;
          return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        },
        (
          payload: { conversationCreated: Conversation },
          _: any,
          ctx: GraphqlContext
        ) => {
          const { session } = ctx;
          const { participants } = payload.conversationCreated;
          const userIsParticipant = !!participants.find(
            (p) => p.userId === session?.user.id
          );
          return userIsParticipant;
        }
      ),

      // subscribe: (_: any, __: any, ctx: GraphqlContext) => {
      //   const { pubsub } = ctx;
      //   return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
      // },
    },
  },
};

export const participantsInclude =
  Prisma.validator<Prisma.ConversationParticipantsInclude>()({
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });

export const conversationsInclude =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      select: {
        hasSeenLatestMessage: true,
        conversationId: true,
        userId: true,
        user: {
          select: {
            id: true,
            image: true,
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
