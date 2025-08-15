import chatModel from "@src/models/chat.model";
import chatMemberModel from "@src/models/chatMember.model";
import userModel from "@src/models/user.model";
import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import { ChatLean, GraphqlContext } from "swift-mini";

const chatResolver = {
  Query: {
    getChats: async (_: unknown, __: unknown, ctx: GraphqlContext) => {
      const { session } = ctx;

      if (!session?.user.username) {
        throw new GraphQLError("User is not authenticated");
      }

      const { id } = session.user;
      const userId = new mongoose.Types.ObjectId(id);

      try {
        const chats = await chatMemberModel.aggregate<ChatLean>([
          {
            $match: {
              memberId: userId
            }
          },
          {
            $lookup: {
              from: "Chat",
              localField: "chatId",
              foreignField: "_id",
              as: "Chat"
            }
          },
          {
            $unwind: "$Chat"
          },
          {
            $lookup: {
              from: "Message",
              pipeline: [
                {
                  $match: {
                    _id: "$Chat.latestMessageId"
                  }
                },
                {
                  $lookup: {
                    from: "User",
                    localField: "senderId",
                    foreignField: "_id",
                    as: "sender"
                  }
                },
                {
                  $unwind: {
                    path: "$sender",
                    preserveNullAndEmptyArrays: true
                  }
                }
              ],
              as: "Chat.chat_latestMessage"
            }
          },
          {
            $unwind: {
              path: "$Chat.chat_latestMessage",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: "ChatMember",
              let: { chatIdVar: "$Chat._id", chatTypeVar: "$Chat.chatType" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$chatId", "$$chatIdVar"] },
                        { $eq: ["$$chatTypeVar", "duo"] } // only include members for duo
                      ]
                    }
                  }
                },
                {
                  $lookup: {
                    from: "User",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "user"
                  }
                },
                {
                  $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                  }
                }
              ],
              as: "Chat.duo_chat_members"
            }
          },
          {
            $addFields: {
              self_member: {
                _id: "$_id",
                memberId: "$memberId",
                chatId: "$chatId",
                lastDelivered: "$lastDelivered",
                lastRead: "$lastRead",
                showChat: "$showChat",
                messageMeta: "$messageMeta",
                role: "$role",
                lastSeen: "$lastSeen",
                hideLastSeen: "$hideLastSeen"
              }
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: ["$Chat", { self_member: "$self_member" }]
              }
            }
          },
          {
            $sort: { updatedAt: -1 }
          }
        ]);

        return chats;
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("Query.getChats error", error);
        throw new GraphQLError(err.message);
      }
    }
  },
  Mutation: {
    createDuoChat: async (
      _: unknown,
      args: { otherUserId: string },
      ctx: GraphqlContext
    ): Promise<{ chatId: string }> => {
      const { session } = ctx;
      const { otherUserId } = args;

      // is user authenticated
      if (!session?.user) throw new GraphQLError("User is not authenticated");

      // checks to see if user exists
      const otherUser = await userModel.findById(otherUserId);

      if (!otherUser)
        throw new GraphQLError(
          `Unable to create chat. User with id ${otherUserId} does not exist`
        );

      const msession = await mongoose.startSession();
      msession.startTransaction();

      try {
        const [chat] = await chatModel.create(
          [{ chatName: "default", chatType: "duo" }],
          { session: msession }
        );

        const chatId = chat.id;
        const memberIds = [otherUserId, session.user.id];

        const chatMembers = memberIds.map((id) => {
          return {
            chatId,
            memberId: id
          };
        });

        await chatMemberModel.insertMany(chatMembers, { session: msession });
        await msession.commitTransaction();

        // emit create subscription event
        // pubsub.publish("CONVERSATION_CREATED", {
        //   conversationCreated: chat
        // });

        return { chatId: chat.id };
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("createDuoChat error", error);
        throw new GraphQLError(err.message);
      }
    }
  }
};

export default chatResolver;
