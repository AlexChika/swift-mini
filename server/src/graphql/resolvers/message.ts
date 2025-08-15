import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { ApiReturn, Conversation, GraphqlContext, Message } from "swift-mini";
import { conversationsInclude } from "./conversations";
import isUserAConversationParticipant from "@lib/utils/isUserAConversationParticipant";
import mongoose from "mongoose";

type SendMessageArgs = {
  senderId: string;
  conversationId: string;
  id: string;
  body: string;
};

type MessageResponse = ApiReturn<Message[], "messages">;

const messageResolver = {
  Query: {
    getMessages: async (
      _: unknown,
      args: { conversationId: string },
      ctx: GraphqlContext
    ): Promise<MessageResponse> => {
      const { session, prisma } = ctx;
      if (!session?.user) throw new GraphQLError("User is not authenticated");

      const { id: userId } = session.user;

      try {
        // validate conversationId is a valid mongo id
        if (!mongoose.isValidObjectId(args.conversationId)) {
          return {
            success: false,
            msg: "Url may be broken or invalid"
          };
        }

        // does conversation exist?
        const conversation = await prisma.conversation.findUnique({
          where: {
            id: args.conversationId
          },
          include: conversationsInclude
        });

        if (!conversation)
          return {
            success: false,
            msg: "We could not find this conversation"
          };

        // does user belong to the conversation?
        if (
          !isUserAConversationParticipant(conversation.participants, userId)
        ) {
          return {
            success: false,
            msg: "You are not a member of this conversation"
          };
        }

        const messages = await prisma.message.findMany({
          where: {
            conversationId: args.conversationId
          },
          include: MessageInclude,
          orderBy: {
            createdAt: "asc"
          }
        });

        return {
          success: true,
          messages,
          msg: "Success"
        };
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("Messages error", error);
        throw new GraphQLError(err.message);
      }
    }
  },

  Mutation: {
    sendMessage: async (
      _: unknown,
      args: SendMessageArgs,
      ctx: GraphqlContext
    ): Promise<boolean> => {
      const { session, prisma, pubsub } = ctx;
      if (!session?.user) throw new GraphQLError("User is not authenticated");

      const { body, conversationId, senderId } = args;
      const { id: userId } = session.user;

      if (senderId !== userId)
        throw new GraphQLError("User is not authenticated");

      console.time("create mesage");
      try {
        const newMessage = await prisma.message.create({
          data: { body, conversationId, senderId },
          include: MessageInclude
        });
        console.timeEnd("create mesage");

        // publish events to users
        pubsub.publish("MESSAGE_SENT", {
          messageSent: newMessage
        });
        console.log(new Date().getSeconds(), "published 1");

        // find the current participant object
        const participant = await prisma.conversationParticipants.findFirst({
          where: {
            conversationId,
            userId
          }
        });

        const conversation = await prisma.conversation.update({
          where: {
            id: conversationId
          },
          data: {
            latestMessageId: newMessage.id,
            participants: {
              update: {
                where: {
                  id: participant?.id || ""
                },
                data: {
                  hasSeenLatestMessage: true
                }
              },

              updateMany: {
                where: {
                  NOT: {
                    userId
                  }
                },
                data: {
                  hasSeenLatestMessage: false
                }
              }
            }
          },

          include: conversationsInclude
        });

        return true;

        // pubsub.publish("CONVERSATION_UPDATED", {
        //   conversationUpdated: conversation,
        // });
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("sendMessage error", error);
        throw new GraphQLError(err.message);
      }
    }
  },

  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: unknown, __: unknown, ctx: GraphqlContext) => {
          const { pubsub } = ctx;
          return pubsub.asyncIterator(["MESSAGE_SENT"]);
        },
        (
          payload: { messageSent: Message },
          args: { conversationId: string },
          ___: unknown
        ) => {
          console.log(new Date().getSeconds(), "subscription 2 ");
          return payload.messageSent.conversationId === args.conversationId;
        }
      )
    }
  }
};

export default messageResolver;

export const MessageInclude = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
      image: true
    }
  }
});
