import { ChatMember } from "swift-mini";
import mongoose, { type Document, Model, Types } from "mongoose";

type TChatMember = Document & ChatMember<Types.ObjectId>;

const lastStatusSchema = new mongoose.Schema(
  {
    time: {
      type: Date,
      required: [true, "Time is required when last status is set"]
    },
    messageId: {
      type: String,
      required: [true, "Message ID is required when last status is set"]
    }
  },
  { _id: false }
);

const chatMemberSchema = new mongoose.Schema<ChatMember<Types.ObjectId>>(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "MongoDB error: ChatId is required"]
    },
    chatType: {
      type: String,
      enum: ["duo", "group"],
      default: "duo",
      required: [true, "MongoDB error: ChatType is required"]
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "MongoDB error: UserId is required"]
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
      required: [true, "MongoDB error: Role is required"]
    },
    lastDelivered: {
      type: lastStatusSchema,
      default: null
    },
    lastRead: {
      type: lastStatusSchema,
      default: null
    },
    messageMeta: {
      type: Map,
      of: new mongoose.Schema({
        messageId: String,
        showMessage: { type: Boolean, default: false },
        time: {
          type: Date,
          default: Date.now
        }
      })
    },
    showChat: {
      type: Boolean,
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

chatMemberSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
chatMemberSchema.index({ chatId: 1, memberId: 1 }, { unique: true });
type ChatMemberModel = Model<TChatMember>;
const chatMemberModel =
  (mongoose.models.ChatMember as ChatMemberModel) ||
  mongoose.model("ChatMember", chatMemberSchema, "ChatMember");

export default chatMemberModel;
