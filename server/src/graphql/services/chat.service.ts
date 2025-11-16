import mongoose from "mongoose";
import chatModel from "@src/models/chat.model";
import { ChatLean } from "swift-mini";
import chatMemberModel from "@src/models/chatMember.model";

export async function getChatCreated(_chatId: string, _userId: string) {
  const chatId = new mongoose.Types.ObjectId(_chatId);
  //   const userId = new mongoose.Types.ObjectId(_userId);

  const [chatCreated] = await chatModel.aggregate<ChatLean>([
    /* ------------- // 1) Match the chatId ------------ */
    {
      $match: {
        _id: chatId
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

    // add chat_latestMessage field as null
    {
      $addFields: {
        chat_latestMessage: null,
        self_member: null
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
  return chatCreated;
}

export async function getChats(_userId?: string) {
  const userId = new mongoose.Types.ObjectId(_userId);

  const chats = await chatModel.aggregate<ChatLean>([
    // 1) Sort early on Chat.updatedAt (add index { updatedAt: -1 } on Chat)
    { $sort: { updatedAt: -1 } },

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

    {
      $addFields: {
        id: { $toString: "$_id" }
      }
    },

    {
      $project: {
        _id: 0,
        id: 1,
        description: 1,
        avatar: 1,
        chatName: 1,
        chatType: 1,
        updatedAt: 1,
        chat_latestMessage: 1,
        duo_chat_members: 1
      }
    }
  ]);

  return chats;
}

export async function getChatMembers(_chatId: string) {
  const memberIds = await chatMemberModel.distinct("memberId", {
    chatId: _chatId
  });
  return memberIds.map((id) => id.toString());
}

/* --- // extracted from chatCreated aggregation --- */
/* --------------------- step 2 -------------------- */
// // 2) Lookup self_member document (probably not needed in future)
// {
//     $lookup: {
//       from: "ChatMember",
//       let: { cid: "$_id" },
//       pipeline: [
//         {
//           $match: {
//             $expr: {
//               $and: [
//                 { $eq: ["$chatId", "$$cid"] },
//                 { $eq: ["$memberId", userId] }
//               ]
//             }
//           }
//         },
//         { $limit: 1 },
//         {
//           $lookup: {
//             from: "User",
//             localField: "memberId",
//             foreignField: "_id",
//             as: "member"
//           }
//         },
//         {
//           $unwind: {
//             path: "$member",
//             preserveNullAndEmptyArrays: true
//           }
//         },
//         {
//           $addFields: {
//             "member.id": { $toString: "$member._id" },
//             id: { $toString: "$_id" }
//           }
//         }
//       ],
//       as: "self_member"
//     }
//   },

//   { $match: { self_member: { $ne: [] } } },
//   { $unwind: "$self_member" },

// /* ---- // 3) Lookup latestMessage documents --- */
// // this shoul be null on chat creation. so we can remove it later
// {
//     $lookup: {
//       from: "Message",
//       localField: "latestMessageId",
//       foreignField: "_id",
//       as: "chat_latestMessage",
//       pipeline: [{ $limit: 1 }, { $addFields: { id: { $toString: "$_id" } } }]
//     }
//   },
//   {
//     $unwind: {
//       path: "$chat_latestMessage",
//       preserveNullAndEmptyArrays: true
//     }
//   },

/* --- // extracted from getChats aggregation for -- */
// const chats = await chatModel.aggregate<ChatLean>([
//   // 1) Sort early on Chat.updatedAt (add index { updatedAt: -1 } on Chat)
//   { $sort: { updatedAt: -1 } },

//   // 2) Keep only chats where this user is a member (cheap, via one lookup)
//   {
//     $lookup: {
//       from: "ChatMember",
//       let: { cid: "$_id" },
//       pipeline: [
//         {
//           $match: {
//             $expr: {
//               $and: [
//                 { $eq: ["$chatId", "$$cid"] },
//                 { $eq: ["$memberId", userId] } // <-- your user
//               ]
//             }
//           }
//         },
//         { $limit: 1 },
//         {
//           $lookup: {
//             from: "User",
//             localField: "memberId",
//             foreignField: "_id",
//             as: "member"
//           }
//         },
//         {
//           $unwind: {
//             path: "$member",
//             preserveNullAndEmptyArrays: true
//           }
//         },
//         {
//           $addFields: {
//             // id: { $toString: "$_id" },
//             "member.id": { $toString: "$member._id" }
//           }
//         }
//       ],
//       as: "self_member"
//     }
//   },
//   { $match: { self_member: { $ne: [] } } },
//   { $unwind: "$self_member" },

//   // 3) Latest message (needs pipeline + let to reference parent)
//   {
//     $lookup: {
//       from: "Message",
//       let: { mid: "$latestMessageId" },
//       pipeline: [
//         { $match: { $expr: { $eq: ["$_id", "$$mid"] } } },
//         {
//           $lookup: {
//             from: "User",
//             localField: "senderId",
//             foreignField: "_id",
//             as: "sender"
//           }
//         },
//         {
//           $unwind: { path: "$sender", preserveNullAndEmptyArrays: true }
//         },
//         {
//           $addFields: {
//             id: { $toString: "$_id" },
//             "sender.id": { $toString: "$sender._id" }
//           }
//         }
//       ],
//       as: "chat_latestMessage"
//     }
//   },
//   {
//     $unwind: {
//       path: "$chat_latestMessage",
//       preserveNullAndEmptyArrays: true
//     }
//   },

//   // 4) Duo members only (skip for groups)
//   {
//     $lookup: {
//       from: "ChatMember",
//       let: { cid: "$_id", ctype: "$chatType" },
//       pipeline: [
//         {
//           $match: {
//             $expr: {
//               $and: [{ $eq: ["$chatId", "$$cid"] }, { $eq: ["$$ctype", "duo"] }]
//             }
//           }
//         },
//         {
//           $lookup: {
//             from: "User",
//             localField: "memberId",
//             foreignField: "_id",
//             as: "member"
//           }
//         },
//         {
//           $unwind: { path: "$member", preserveNullAndEmptyArrays: true }
//         },
//         {
//           $addFields: {
//             id: { $toString: "$_id" },
//             "member.id": { $toString: "$member._id" }
//           }
//         }
//       ],
//       as: "duo_chat_members"
//     }
//   },

//   // 6) Add nice string ids + lift self_member to top-level
//   {
//     $addFields: {
//       id: { $toString: "$_id" },
//       "self_member.id": { $toString: "$self_member._id" }
//     }
//   },

//   // 7) Project only what your GraphQL ChatLean needs (keeps payload small)

//   // when the client is fully built, we will trim this down to only the fields we need

//   // Also, we would trim graphql typeDefs to only the fields we need

//   // but for now, we will keep it all to make sure everything works

//   {
//     $project: {
//       _id: 0,
//       id: 1,
//       description: 1,
//       avatar: 1,
//       // superAdmin: 1,
//       // groupAdmins: 1,
//       chatName: 1,
//       chatType: 1,
//       // groupType: 1,
//       // inviteLink: 1,
//       // createdAt: 1,
//       updatedAt: 1,
//       // joinRequests: 1,
//       // latestMessageId: 1,
//       chat_latestMessage: 1,
//       duo_chat_members: 1,
//       self_member: 1
//       // "chat_latestMessage.id": 1,
//       // "chat_latestMessage.content": 1,
//       // "chat_latestMessage.sender.id": 1,
//       // "chat_latestMessage.sender.username": 1,
//       // "duo_chat_members.id": 1,
//       // "duo_chat_members.member.id": 1,
//       // "duo_chat_members.member.username": 1,
//       // "self_member.id": 1,
//       // "self_member.role": 1,
//       // "self_member.lastRead": 1
//     }
//   }
// ]);
