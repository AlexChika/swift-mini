import { dateScalar } from "./scalers";
import { GraphQLError } from "graphql";
import { Prisma } from "@prisma/client";
import { withFilter } from "graphql-subscriptions";
import { Conversation, GraphqlContext } from "swift-mini";
import chatMemberModel from "@src/models/chatMember.model";
import chatModel from "@src/models/chat.model";
import userModel from "@src/models/user.model";
import mongoose from "mongoose";

const conversationResolver = {
  Date: dateScalar,
  Query: {
    conversations: async (_: unknown, __: unknown, ctx: GraphqlContext) => {
      const { session, prisma } = ctx;

      if (!session?.user.username) {
        throw new GraphQLError("User is not authenticated");
      }

      const { id } = session.user;
      const userId = new mongoose.Types.ObjectId(id);

      const chats = await chatMemberModel.aggregate([
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

      console.log({ chats });
      console.log(JSON.stringify(chats, null, 2));

      try {
        const convos = await prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userId: {
                  equals: id
                }
              }
            }
          },

          include: conversationsInclude
        });
        return convos;
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("Conversation error", error);
        throw new GraphQLError(err.message);
      }
    },
    getChats: async (_: unknown, __: unknown, ctx: GraphqlContext) => {
      const { session } = ctx;

      if (!session?.user.username) {
        throw new GraphQLError("User is not authenticated");
      }

      const { id } = session.user;
      const userId = new mongoose.Types.ObjectId(id);

      try {
        const chats = await chatMemberModel.aggregate([
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
    createConversation: async (
      _: unknown,
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
                    hasSeenLatestMessage: id === userId
                  };
                })
              }
            }
          },

          include: conversationsInclude
        });

        // emit create subscription event
        pubsub.publish("CONVERSATION_CREATED", {
          conversationCreated: conversation
        });

        return { conversationId: conversation.id };
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("createConversation error", error);
        throw new GraphQLError(err.message);
      }
    },

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

    // createGroupChat: async (
    //   _: unknown,
    //   args: { participantIds: string[] },
    //   ctx: GraphqlContext
    // ): Promise<{ chatId: string }> => {
    //   const { session, pubsub } = ctx;
    //   const { chatMemberIds } = args;

    //   if (!session?.user) throw new GraphQLError("User is not authenticated");

    //   const { id: userId } = session.user;

    //   try {
    //     const conversation = await prisma.conversation.create({
    //       data: {
    //         participants: {
    //           createMany: {
    //             data: participantIds.map((id) => {
    //               return {
    //                 userId: id,
    //                 hasSeenLatestMessage: id === userId
    //               };
    //             })
    //           }
    //         }
    //       },

    //       include: conversationsInclude
    //     });

    //     // emit create subscription event
    //     pubsub.publish("CONVERSATION_CREATED", {
    //       conversationCreated: conversation
    //     });

    //     return { chatId: conversation.id };
    //   } catch (error) {
    //     const err = error as unknown as { message: string };
    //     console.log("createConversation error", error);
    //     throw new GraphQLError(err.message);
    //   }
    // }
  },
  Subscription: {
    conversationCreated: {
      subscribe: withFilter(
        (_: unknown, __: unknown, ctx: GraphqlContext) => {
          const { pubsub } = ctx;
          return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        },
        (
          payload: { conversationCreated: Conversation },
          _: unknown,
          ctx: GraphqlContext
        ) => {
          const { session } = ctx;
          const { participants } = payload.conversationCreated;
          const userIsParticipant = !!participants.find(
            (p: { userId: string | undefined }) => p.userId === session?.user.id
          );
          return userIsParticipant;
        }
      )

      // subscribe: (_: any, __: any, ctx: GraphqlContext) => {
      //   const { pubsub } = ctx;
      //   return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
      // },
    }
  }
};

export const participantsInclude =
  Prisma.validator<Prisma.ConversationParticipantsInclude>()({
    user: {
      select: {
        id: true,
        username: true
      }
    }
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
            username: true
          }
        }
      }
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true
          }
        }
      }
    }
  });
export default conversationResolver;

// // 3️⃣ Lookup the auditor for that user
// {
//   $lookup: {
//     from: "auditors",
//     localField: "user.auditorId", // field from the joined user object
//     foreignField: "_id",
//     as: "user.auditor"           // nested result
//   }
// },
// { $unwind: "$user.auditor" }, // make auditor a single object

// const user = await User.findById(userId);
// const cutoff = new Date(newDateFromUserAction);

// for (const [key, value] of user.meta.entries()) {
//   if (value.timestamp < cutoff) {
//     user.meta.delete(key);
//   }
// }

// await user.save();
