import { connectDB } from "lib/db";
const mongoose = await connectDB();
import { type Document, Model, Types } from "mongoose";
import { Chat } from "swift-mini";

type TChatDocument = Document & Chat<Types.ObjectId>;

const joinRequest = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "MongoDB error: User ID is required for join requests"]
    }
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema<Chat<Types.ObjectId>>(
  {
    description: {
      type: String,
      default: ""
    },
    superAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      validate: {
        validator: function (value: string) {
          return this.chatType !== "group" || !!value;
        },
        message: "MongoDB error: SuperAdmin is required for group chats"
      }
    },
    groupAdmins: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      validate: {
        validator: function (value) {
          return (
            this.chatType !== "group" ||
            (Array.isArray(value) && value.length > 0)
          );
        },
        message: "MongoDB error: Group admins are required for group chats"
      }
    },
    avatar: {
      type: String,
      default: "default",
      validate: {
        validator: function (value) {
          return this.chatType !== "group" || value.trim().length > 0;
        },
        message: "MongoDB error: Avatar is required for group chats"
      }
    },
    chatName: {
      type: String,
      default: "default",
      validate: {
        validator: function (value) {
          return this.chatType !== "group" || value.trim().length > 0;
        },
        message: "MongoDB error: ChatName is required for group chats"
      }
    },
    chatType: {
      type: String,
      enum: ["duo", "group"],
      default: "duo",
      required: true
    },
    groupType: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      validate: {
        validator: function (value) {
          return (
            this.chatType !== "group" || ["public", "private"].includes(value)
          );
        },
        message: "MongoDB error: Group type is required for group chats"
      }
    },
    inviteLink: {
      type: String,
      default: null,
      validate: {
        validator: function (value) {
          return (
            this.chatType !== "group" ||
            (typeof value === "string" && value.trim().length > 0)
          );
        },
        message: "MongoDB error: Invite link is required for group chats"
      }
    },
    joinRequests: { type: [joinRequest], default: [] },
    latestMessageId: { type: String, default: null }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

chatSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
chatSchema.index({ updatedAt: -1 });

type ChatModel = Model<TChatDocument>;

const chatModel =
  (mongoose.models.Chat as ChatModel) ||
  mongoose.model("Chat", chatSchema, "Chat");

export default chatModel;
