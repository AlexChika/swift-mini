import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import { dateScalar } from "./scalers";
import { Prisma } from "@prisma/client";
import { inviteLinkEncoder } from "@lib/utils";
import chatModel from "@src/models/chat.model";
import userModel from "@src/models/user.model";
import { withFilter } from "graphql-subscriptions";
import chatMemberModel from "@src/models/chatMember.model";
import {
  ChatLean,
  ChatPopulated,
  Conversation,
  GraphqlContext,
  User
} from "swift-mini";

type createGroupChatArgs = {
  description: string;
  chatName: string;
  groupType: "private" | "public";
  memberIds: string[];
};

type createDuoChatArgs = {
  otherUserId: string;
};

// TODO: refactor for conssistent returns and user error messages. also provides system only errors for server/client debugging

const conversationResolver = {
  Date: dateScalar,
  Query: {
    conversations: async (_: unknown, __: unknown, ctx: GraphqlContext) => {
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
      const uid = new mongoose.Types.ObjectId(userId); // ensure type matches your schema

      try {
        const chats = await chatModel.aggregate([
          // 1) Sort early on Chat.updatedAt (add index { updatedAt: -1 } on Chat)
          { $sort: { updatedAt: -1 } },

          // 2) Keep only chats where this user is a member (cheap, via one lookup)
          {
            $lookup: {
              from: "ChatMember",
              let: { cid: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$chatId", "$$cid"] },
                        { $eq: ["$memberId", uid] } // <-- your user
                      ]
                    }
                  }
                },
                { $limit: 1 },
                {
                  $lookup: {
                    from: "User",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "member"
                  }
                },
                {
                  $unwind: {
                    path: "$member",
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $addFields: {
                    // id: { $toString: "$_id" },
                    "member.id": { $toString: "$member._id" }
                  }
                }
              ],
              as: "self_member"
            }
          },
          { $match: { self_member: { $ne: [] } } },
          { $unwind: "$self_member" },

          // 3) Latest message (needs pipeline + let to reference parent)
          {
            $lookup: {
              from: "Message",
              let: { mid: "$latestMessageId" },
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$mid"] } } },
                {
                  $lookup: {
                    from: "User",
                    localField: "senderId",
                    foreignField: "_id",
                    as: "sender"
                  }
                },
                {
                  $unwind: { path: "$sender", preserveNullAndEmptyArrays: true }
                },
                {
                  $addFields: {
                    id: { $toString: "$_id" },
                    "sender.id": { $toString: "$sender._id" }
                  }
                }
              ],
              as: "chat_latestMessage"
            }
          },
          {
            $unwind: {
              path: "$chat_latestMessage",
              preserveNullAndEmptyArrays: true
            }
          },

          // 4) Duo members only (skip for groups)
          {
            $lookup: {
              from: "ChatMember",
              let: { cid: "$_id", ctype: "$chatType" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$chatId", "$$cid"] },
                        { $eq: ["$$ctype", "duo"] }
                      ]
                    }
                  }
                },
                {
                  $lookup: {
                    from: "User",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "member"
                  }
                },
                {
                  $unwind: { path: "$member", preserveNullAndEmptyArrays: true }
                },
                {
                  $addFields: {
                    id: { $toString: "$_id" },
                    "member.id": { $toString: "$member._id" }
                  }
                }
              ],
              as: "duo_chat_members"
            }
          },

          // 6) Add nice string ids + lift self_member to top-level
          {
            $addFields: {
              id: { $toString: "$_id" },
              "self_member.id": { $toString: "$self_member._id" }
            }
          },

          // 7) Project only what your GraphQL ChatLean needs (keeps payload small)

          // when the client is fully built, we will trim this down to only the fields we need

          // Also, we would trim graphql typeDefs to only the fields we need

          // but for now, we will keep it all to make sure everything works

          {
            $project: {
              _id: 0,
              id: 1,
              description: 1,
              // superAdmin: 1,
              // groupAdmins: 1,
              chatName: 1,
              chatType: 1,
              // groupType: 1,
              // inviteLink: 1,
              // createdAt: 1,
              updatedAt: 1,
              // joinRequests: 1,
              // latestMessageId: 1,
              chat_latestMessage: 1,
              duo_chat_members: 1,
              self_member: 1
              // "chat_latestMessage.id": 1,
              // "chat_latestMessage.content": 1,
              // "chat_latestMessage.sender.id": 1,
              // "chat_latestMessage.sender.username": 1,
              // "duo_chat_members.id": 1,
              // "duo_chat_members.member.id": 1,
              // "duo_chat_members.member.username": 1,
              // "self_member.id": 1,
              // "self_member.role": 1,
              // "self_member.lastRead": 1
            }
          }
        ]);

        // console.log(JSON.stringify(chats, null, 2));
        // console.log(chats);

        return chats;
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("Query.getChats error", error);
        throw new GraphQLError(err.message);
      }
    },
    getChat: async (
      _: unknown,
      args: { chatId: string },
      ctx: GraphqlContext
    ) => {
      const { session } = ctx;

      if (!session?.user.username) {
        throw new GraphQLError("User is not authenticated");
      }

      // check if chatId is valid
      if (!args.chatId || !mongoose.isValidObjectId(args.chatId)) {
        throw new GraphQLError(`The provided chatId ${args.chatId} is invalid`);
      }

      const { id } = session.user;
      const chatId = new mongoose.Types.ObjectId(args.chatId);

      // check if user is a member of the chat
      const isMember = await chatMemberModel.exists({
        chatId,
        memberId: id
      });

      if (!isMember) {
        throw new GraphQLError(
          `We could not find the chat you are looking for.`
        );
      }

      try {
        const [chat] = await chatModel.aggregate<
          ChatPopulated & { joinRequestUsers?: User<string>[] }
        >([
          /* ------------- // 1) Match the chatId ------------ */
          {
            $match: {
              _id: chatId
            }
          },

          /* ----- // 2) Lookup superAdmin User document ----- */
          {
            $lookup: {
              from: "User",
              localField: "superAdmin",
              foreignField: "_id",
              as: "chat_superAdmin",
              pipeline: [
                { $limit: 1 },
                { $addFields: { id: { $toString: "$_id" } } }
              ]
            }
          },
          {
            $unwind: {
              path: "$chat_superAdmin",
              preserveNullAndEmptyArrays: true
            }
          },

          /* ---- // 3 ) Lookup groupAdmins User documents --- */
          {
            $lookup: {
              from: "User",
              localField: "groupAdmins",
              foreignField: "_id",
              as: "chat_groupAdmins",

              pipeline: [
                // can replace this with $project, limit fields and add id like below instead of with $addFields

                // {
                //   $project: {
                //     _id: 0,
                //     id: { $toString: "$_id" },
                //     username: 1,
                //     image: 1
                //   }
                // },

                {
                  $addFields: {
                    id: { $toString: "$_id" }
                  }
                }
              ]
            }
          },

          /* ---- // 4) Lookup latestMessage documents --- */
          {
            $lookup: {
              from: "Message",
              localField: "latestMessageId",
              foreignField: "_id",
              as: "chat_latestMessage",
              pipeline: [
                { $limit: 1 },
                { $addFields: { id: { $toString: "$_id" } } }
              ]
            }
          },
          {
            $unwind: {
              path: "$chat_latestMessage",
              preserveNullAndEmptyArrays: true
            }
          },

          /* ------ // 5) Lookup chat_members documents ------ */
          {
            $lookup: {
              from: "ChatMember",
              localField: "_id",
              foreignField: "chatId",
              as: "chat_members",
              pipeline: [
                {
                  $lookup: {
                    from: "User",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "member",
                    pipeline: [{ $limit: 1 }]
                  }
                },
                {
                  $unwind: {
                    path: "$member",
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $addFields: {
                    id: { $toString: "$_id" },
                    "member.id": { $toString: "$member._id" }
                  }
                }
              ]
            }
          },

          /* ------ // 6) Lookup joinRequests documents ------ */
          {
            $lookup: {
              from: "User",
              localField: "_id",
              foreignField: "joinRequests.userId",
              pipeline: [
                {
                  $addFields: { id: { $toString: "$_id" } }
                }
              ],
              as: "joinRequestUsers"
            }
          },

          // 7) Project the final shape of the Chat object
          {
            $project: {
              _id: 0,
              id: { $toString: "$_id" },
              description: 1,
              superAdmin: 1,
              groupAdmins: 1,
              chatName: 1,
              chatType: 1,
              groupType: 1,
              inviteLink: 1,
              joinRequests: 1,
              latestMessageId: 1,
              createdAt: 1,
              updatedAt: 1,
              chat_superAdmin: 1,
              chat_groupAdmins: 1,
              chat_latestMessage: 1,
              chat_members: 1,
              joinRequestUsers: 1
            }
          }
          //   $lookup: {
          //     from: "ChatMember",
          //     // let: { chatIdVar: "$Chat._id" },
          //     pipeline: [
          //       {
          //         $match: {
          //           chatId: "$Chat._id"
          //         }
          //       },
          //       {
          //         $lookup: {
          //           from: "User",
          //           localField: "memberId",
          //           foreignField: "_id",
          //           as: "user"
          //         }
          //       },
          //       {
          //         $unwind: {
          //           path: "$user",
          //           preserveNullAndEmptyArrays: true
          //         }
          //       }
          //     ],
          //     as: "Chat.chat_members"
          //   }
          // },
        ]);

        // if no chat found, throw error
        if (!chat) {
          throw new GraphQLError(`Chat with id ${args.chatId} not found`);
        }

        if (chat.joinRequestUsers) {
          const userMap = new Map(
            chat.joinRequestUsers.map((user) => [String(user._id), user])
          );

          const chat_joinRequests = chat.joinRequests.map((req) => ({
            createdAt: req.createdAt,
            userId: req.userId,
            user: userMap.get(String(req.userId)) || null
          }));

          chat.chat_joinRequests = chat_joinRequests;
          delete chat.joinRequestUsers; // Clean up the temporary field
        }

        // console.log(JSON.stringify(chat, null, 2));
        // console.log(chat);

        return chat;
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
      args: createDuoChatArgs,
      ctx: GraphqlContext
    ): Promise<{ chatId: string }> => {
      const { session, pubsub } = ctx;
      const { otherUserId } = args;

      // is user authenticated
      if (!session?.user) throw new GraphQLError("User is not authenticated");

      // validate otherUserId
      if (!otherUserId || !mongoose.isValidObjectId(otherUserId)) {
        throw new GraphQLError(`The provided userId ${otherUserId} is invalid`);
      }

      // checks to see if user exists
      const otherUser = await userModel.findById(otherUserId);

      if (!otherUser)
        throw new GraphQLError(
          `Unable to create chat. User with id ${otherUserId} does not exist`
        );

      // check if duo chat already exists with the other user
      // const existingChat = await chatMemberModel.findOne({
      //   memberId: session.user.id,
      //   chatType: "duo",
      //   chatId: {
      //     $in: await chatMemberModel
      //       .find({ memberId: otherUserId, chatType: "duo" })
      //       .distinct("chatId")
      //   }
      // });

      // if (existingChat) {
      //   return { chatId: existingChat.chatId.toString() };
      // }

      const msession = await mongoose.startSession();
      msession.startTransaction();

      try {
        const [chat] = await chatModel.create(
          [{ chatName: "default", chatType: "duo" }],
          { session: msession }
        );

        const chatId = chat.id as string;
        const memberIds = [otherUserId, session.user.id];

        const chatMembers = memberIds.map((id) => {
          return {
            chatId,
            chatType: "duo",
            memberId: id,
            showChat: session.user.id === id // only show chat for the user who created it
          };
        });

        await chatMemberModel.insertMany(chatMembers, { session: msession });
        await msession.commitTransaction();

        // start of temporal code
        const _chatId = new mongoose.Types.ObjectId(chatId);
        const userId = new mongoose.Types.ObjectId(session.user.id);

        const [chatCreated] = await chatModel.aggregate<ChatLean>([
          /* ------------- // 1) Match the chatId ------------ */
          {
            $match: {
              _id: _chatId
            }
          },

          // 2) Lookup self_member document
          {
            $lookup: {
              from: "ChatMember",
              let: { cid: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$chatId", "$$cid"] },
                        { $eq: ["$memberId", userId] }
                      ]
                    }
                  }
                },
                { $limit: 1 },
                {
                  $lookup: {
                    from: "User",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "member"
                  }
                },
                {
                  $unwind: {
                    path: "$member",
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $addFields: {
                    "member.id": { $toString: "$member._id" },
                    id: { $toString: "$_id" }
                  }
                }
              ],
              as: "self_member"
            }
          },

          { $match: { self_member: { $ne: [] } } },
          { $unwind: "$self_member" },

          /* ---- // 3) Lookup latestMessage documents --- */
          {
            $lookup: {
              from: "Message",
              localField: "latestMessageId",
              foreignField: "_id",
              as: "chat_latestMessage",
              pipeline: [
                { $limit: 1 },
                { $addFields: { id: { $toString: "$_id" } } }
              ]
            }
          },
          {
            $unwind: {
              path: "$chat_latestMessage",
              preserveNullAndEmptyArrays: true
            }
          },

          /* ------ // 4) Lookup duo_chat_members documents ------ */
          {
            $lookup: {
              from: "ChatMember",
              let: { cid: "$_id", ctype: "$chatType" },
              as: "duo_chat_members",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$chatId", "$$cid"] },
                        { $eq: ["$chatType", "$$ctype"] }
                      ]
                    }
                  }
                },
                {
                  $lookup: {
                    from: "User",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "member",
                    pipeline: [{ $limit: 1 }]
                  }
                },
                {
                  $unwind: {
                    path: "$member",
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $addFields: {
                    id: { $toString: "$_id" },
                    "member.id": { $toString: "$member._id" }
                  }
                }
              ]
            }
          },

          // 5) Project the final shape of the Chat object
          {
            $project: {
              _id: 0,
              id: { $toString: "$_id" },
              description: 1,
              superAdmin: 1,
              groupAdmins: 1,
              chatName: 1,
              chatType: 1,
              groupType: 1,
              inviteLink: 1,
              joinRequests: 1,
              latestMessageId: 1,
              createdAt: 1,
              updatedAt: 1,
              chat_latestMessage: 1,
              duo_chat_members: 1,
              self_member: 1
            }
          }
        ]);

        // end of temporal code
        // emit create subscription event
        pubsub.publish("CHAT_CREATED", {
          chatCreated
        });

        return { chatId: chat.id };
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("createDuoChat error", error);
        throw new GraphQLError(err.message);
      }
    },

    createGroupChat: async (
      _: unknown,
      args: createGroupChatArgs,
      ctx: GraphqlContext
    ): Promise<{ chatId: string }> => {
      const { session } = ctx;
      const { chatName, description, groupType, memberIds } = args;

      // is user authenticated
      if (!session?.user) throw new GraphQLError("User is not authenticated");

      // Remove duplicates and ensure valid ObjectId format
      const uniqueIds = [...new Set(memberIds)].filter((id) =>
        mongoose.isValidObjectId(id)
      );

      if (!uniqueIds.length) {
        throw new Error("No valid member IDs provided");
      }

      // validate that memberIds are real existing users
      const existingUsers = await userModel
        .find(
          { _id: { $in: uniqueIds } },
          { _id: 1 } // only fetch IDs
        )
        .lean();

      const existingUserIds = existingUsers.map((user) => user._id.toString());

      // Find invalid IDs
      const invalidIds = uniqueIds.filter(
        (id) => !existingUserIds.includes(id)
      );

      if (invalidIds.length) {
        throw new Error(`Invalid user IDs: ${invalidIds.join(", ")}`);
      }

      // validate all arguments
      if (!chatName || chatName.trim().length === 0) {
        throw new GraphQLError("Chat name is required for group chats");
      }
      if (!description || description.trim().length === 0) {
        throw new GraphQLError("Description is required for group chats");
      }
      if (!groupType || !["private", "public"].includes(groupType)) {
        throw new GraphQLError(
          "Group type must be either 'private' or 'public'"
        );
      }

      const chatId = new mongoose.Types.ObjectId();
      const inviteLink = inviteLinkEncoder("encode", {
        chatId: chatId.toString()
      });

      const chatData = {
        _id: chatId,
        chatName,
        description,
        groupType,
        chatType: "group",
        superAdmin: session.user.id,
        groupAdmins: [session.user.id],
        inviteLink
      };

      const msession = await mongoose.startSession();
      msession.startTransaction();

      try {
        await chatModel.create([chatData], { session: msession });

        const memberIds = [...existingUserIds, session.user.id];

        const chatMembers = memberIds.map((id) => {
          return {
            chatId,
            chatType: "group",
            memberId: id,
            role: id === session.user.id ? "admin" : "member",
            showChat: true // show chat for all members
          };
        });

        await chatMemberModel.insertMany(chatMembers, { session: msession });
        await msession.commitTransaction();

        // emit create subscription event
        // pubsub.publish("CONVERSATION_CREATED", {
        //   conversationCreated: chat
        // });

        return { chatId: chatId.toString() };
      } catch (error) {
        const err = error as unknown as { message: string };
        console.log("createDuoChat error", error);
        throw new GraphQLError(err.message);
      }
    }
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
    },
    chatCreated: {
      subscribe: withFilter(
        (_: unknown, __: unknown, ctx: GraphqlContext) => {
          const { pubsub } = ctx;
          return pubsub.asyncIterator(["CHAT_CREATED"]);
        },
        (
          payload: {
            chatCreated: ChatLean;
          },
          _: unknown,
          ctx: GraphqlContext
        ) => {
          const { session } = ctx;
          const { chatCreated } = payload;

          console.log({ chatCreated });

          const userIsAMember = !!chatCreated.duo_chat_members.find(
            (m) => m.memberId.toString() === session?.user.id
          );
          return userIsAMember;
        }
      )
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

// const user = await User.findById(userId);
// const cutoff = new Date(newDateFromUserAction);

// for (const [key, value] of user.meta.entries()) {
//   if (value.timestamp < cutoff) {
//     user.meta.delete(key);
//   }
// }

// await user.save();
