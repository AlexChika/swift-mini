import { validateField } from "@lib/utils";
import mongoose, { Types } from "mongoose";
import { getMemberIds } from "./chat.service";
import messageModel from "@src/models/messages.model";

type CreateMessageReturn = ApiReturn<Message<Types.ObjectId>, "message">;

export async function createMessage(
  data: Swift.CreateMessageJob,
  msession?: mongoose.mongo.ClientSession
): Promise<CreateMessageReturn> {
  const { message, userId } = data;
  const { body, chatId, senderId, type } = message;

  /* ------------------- // isUser ------------------- */
  if (senderId !== userId)
    return {
      success: false,
      msg: "Operation not allowed"
    };

  /* ------------- // valid all mongoIds ------------- */
  const mongoIds = [
    { id: chatId, name: "chatId" },
    { id: senderId, name: "senderId" }
  ];

  for (const id of mongoIds) {
    if (!id.id || !mongoose.isValidObjectId(id.id)) {
      return {
        success: false,
        msg: `Invalid ID provided for ${id.name}`
      };
    }
  }

  /* --------------- // validate values -------------- */
  const fields = [
    {
      name: "body",
      value: body,
      msg: "Message body cannot be empty"
    },
    {
      name: "type",
      value: type,
      msg: "Invalid message type",
      validator: (v: string) =>
        ["text", "image", "video", "audio", "file", "location"].includes(v)
    }
  ];
  for (const field of fields) {
    const check = validateField(field.value, field.msg, field.validator);
    if (!check.success) return check;
  }

  /* ---- // validate that sender is a chat member --- */
  const ids = await getMemberIds(chatId);
  if (!ids.includes(senderId))
    return {
      success: false,
      msg: "You are not a member of this chat"
    };

  /* --------------- // create message --------------- */
  const [newMessage] = await messageModel.create(
    [
      {
        body,
        chatId,
        senderId,
        type
      }
    ],
    { session: msession }
  );

  return {
    success: true,
    msg: "success",
    message: newMessage.toObject()
  };
}

export async function getMessage(id: string) {
  const message = await messageModel.findById<Message<Types.ObjectId>>(id);
  return message;
}

export async function getMessages(chatId: string) {
  const messages = await messageModel
    .find({ chatId })
    .sort({ createdAt: -1 })
    .limit(20);

  return messages;
}

export async function getMessagesBefore(chatId: string, createdAt: Date) {
  const messages = await messageModel
    .find({ chatId, createdAt: { $lt: createdAt } })
    .sort({ createdAt: -1 })
    .limit(20);
  return messages;
}

export async function getMessagesAfter(chatId: string, createdAt: Date) {
  const messages = await messageModel
    .find({ chatId, createdAt: { $gt: createdAt } })
    .sort({ createdAt: 1 })
    .limit(20);
  return messages;
}

export async function getMessagesAround(chatId: string, createdAt: Date) {
  const messages = await messageModel
    .find({ chatId, createdAt: { $ne: createdAt } })
    .sort({ createdAt: 1 })
    .limit(20);
  return messages;
}
