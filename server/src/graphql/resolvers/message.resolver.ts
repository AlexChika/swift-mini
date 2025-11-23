import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import messageModel from "@src/models/messages.model";
import chatMemberModel from "@src/models/chatMember.model";

type SendMessageArgs = {
  senderId: string;
  chatId: string;
  body: string;
};

type MessageResponse = ApiReturn<Message<string>[], "messages">;

const messageResolver = {
  Query: {
    getMessages: async (
      _: unknown,
      args: { chatId: string },
      ctx: GraphqlContext
    ): Promise<MessageResponse> => {
      const { session } = ctx;

      // check if user is authenticated
      if (!session?.user) throw new GraphQLError("User is not authenticated");

      // validate chatId is a valid mongo id
      if (!mongoose.isValidObjectId(args.chatId)) {
        return {
          success: false,
          msg: "Url may be broken or invalid"
        };
      }

      try {
        const userId = new mongoose.Types.ObjectId(session.user.id);
        const chatId = new mongoose.Types.ObjectId(args.chatId);

        // checks if chat exists and if user is a member of the chat
        const isUserAChatMember = await chatMemberModel.exists({
          chatId,
          memberId: userId
        });

        if (!isUserAChatMember)
          return {
            success: false,
            msg: "We could not find the chat you are looking for"
          };

        const messages = await messageModel.aggregate([
          { $match: { chatId } },
          {
            $lookup: {
              from: "User",
              localField: "senderId",
              foreignField: "_id",
              pipeline: [{ $addFields: { id: { $toString: "$_id" } } }],
              as: "sender"
            }
          },
          { $unwind: "$sender" },
          {
            $project: {
              id: { $toString: "$_id" },
              chatId: 1,
              senderId: 1,
              body: 1,
              createdAt: 1,
              updatedAt: 1,
              sender: 1,
              deleted: 1,
              editted: 1,
              meta: 1
              // sender: {
              //   id: "$sender._id",
              //   username: "$sender.username",
              //   image: "$sender.image"
              // },
            }
          },
          { $sort: { createdAt: 1 } }
        ]);

        return {
          success: true,
          messages,
          msg: "success"
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
      const { session } = ctx;

      // check if user is authenticated
      if (!session?.user) throw new GraphQLError("User is not authenticated");

      const { body, chatId, senderId } = args;

      if (senderId !== session.user.id)
        throw new GraphQLError("Operation not allowed");

      // validate chatId is a valid mongo id
      if (!mongoose.isValidObjectId(chatId)) {
        throw new GraphQLError("Url may be broken or invalid");
      }

      // validate senderId is a valid mongo id
      if (!mongoose.isValidObjectId(senderId)) {
        throw new GraphQLError("Invalid sender ID");
      }

      //validate body is a string
      if (typeof body !== "string" || body.trim().length === 0) {
        throw new GraphQLError("Message body must be a non-empty string");
      }

      console.time("create mesage");

      const isUserAChatMember = await chatMemberModel.exists({
        chatId,
        memberId: senderId
      });

      if (!isUserAChatMember) {
        throw new GraphQLError("You are not a member of this chat");
      }

      try {
        const newMessage = await messageModel.create({
          body,
          chatId,
          senderId
        });

        console.timeEnd("create mesage");
        return true;
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("sendMessage error", error);
        throw new GraphQLError(err.message);
      }
    }
  }
};

export default messageResolver;
