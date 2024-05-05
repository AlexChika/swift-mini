import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { Conversation, GraphqlContext, Message } from "swift-mini";
import { conversationsInclude } from "./conversations";
import { isUserAConversationParticipant } from "#lib";

type SendMessageArgs = {
  senderId: string;
  conversationId: string;
  id: string;
  body: string;
};

const messageResolver = {
  Query: {
    messages: async (
      _: any,
      args: { conversationId: string },
      ctx: GraphqlContext
    ): Promise<Message[]> => {
      const { session, prisma, pubsub } = ctx;
      if (!session?.user) throw new GraphQLError("User is not authenticated");

      const { id: userId } = session.user;

      try {
        // does conversation exist?
        const conversation = await prisma.conversation.findUnique({
          where: {
            id: args.conversationId,
          },
          include: conversationsInclude,
        });

        if (!conversation) throw new GraphQLError("Conversation is not found");

        // does user belong to the conversation?
        if (!isUserAConversationParticipant(conversation.participants, userId))
          throw new GraphQLError("You are not authenticated");

        const messages = prisma.message.findMany({
          where: {
            conversationId: args.conversationId,
          },
          include: MessageInclude,
          orderBy: {
            createdAt: "desc",
          },
        });

        return messages;
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("Messages error", error);
        throw new GraphQLError(err.message);
      }
    },
  },

  Mutation: {
    sendMessage: async (
      _: any,
      args: SendMessageArgs,
      ctx: GraphqlContext
    ): Promise<boolean> => {
      const { session, prisma, pubsub } = ctx;
      if (!session?.user) throw new GraphQLError("User is not authenticated");

      const { body, conversationId, senderId } = args;
      const { id: userId } = session.user;

      if (senderId !== userId)
        throw new GraphQLError("User is not authenticated");

      try {
        const newMessage = await prisma.message.create({
          data: { body, conversationId, senderId },
          include: MessageInclude,
        });

        // find the current participant object
        const participant = await prisma.conversationParticipants.findFirst({
          where: {
            conversationId,
            userId,
          },
        });

        const conversation = await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            latestMessageId: newMessage.id,
            participants: {
              update: {
                where: {
                  id: participant?.id || "",
                },
                data: {
                  hasSeenLatestMessage: true,
                },
              },

              updateMany: {
                where: {
                  NOT: {
                    userId,
                  },
                },
                data: {
                  hasSeenLatestMessage: false,
                },
              },
            },
          },

          include: conversationsInclude,
        });

        // publish events to users
        pubsub.publish("MESSAGE_SENT", {
          messageSent: newMessage,
        });

        // pubsub.publish("CONVERSATION_UPDATED", {
        //   conversationUpdated: conversation,
        // });

        console.log({ newMessage, conversation });
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("sendMessage error", error);
        throw new GraphQLError(err.message);
      }

      return true;
    },
  },

  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: any, __: any, ctx: GraphqlContext) => {
          const { pubsub } = ctx;
          return pubsub.asyncIterator(["MESSAGE_SENT"]);
        },
        (
          payload: { messageSent: Message },
          args: { conversationId: string },
          ___: any
        ) => {
          console.log({
            sub: payload.messageSent.conversationId === args.conversationId,
          });
          return payload.messageSent.conversationId === args.conversationId;
        }
      ),
    },
    // conversationCreated: {
    //   subscribe: withFilter(
    //     (_: any, __: any, ctx: GraphqlContext) => {
    //       const { pubsub } = ctx;
    //       return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
    //     },
    //     (
    //       payload: { conversationCreated: Conversation },
    //       _: any,
    //       ctx: GraphqlContext
    //     ) => {
    //       const { session } = ctx;
    //       const { participants } = payload.conversationCreated;
    //       const userIsParticipant = !!participants.find(
    //         (p) => p.userId === session?.user.id
    //       );
    //       return userIsParticipant;
    //     }
    //   ),

    //   // subscribe: (_: any, __: any, ctx: GraphqlContext) => {
    //   //   const { pubsub } = ctx;
    //   //   return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
    //   // },
    // },
  },
};

export default messageResolver;

export const MessageInclude = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    },
  },
});
