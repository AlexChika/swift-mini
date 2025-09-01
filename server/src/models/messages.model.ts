import { connectDB } from "lib/db";
const mongoose = await connectDB();
import { type Document, Model, Types } from "mongoose";
import { Message } from "swift-mini";

type TMessage = Document & Message<Types.ObjectId>;

const messageSchema = new mongoose.Schema<Message<Types.ObjectId>>(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "MongoDB error: ConversationId is required"]
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "MongoDB error: SenderId is required"]
    },
    body: {
      type: String,
      required: [true, "MongoDB error: Body is required"]
    },
    deleted: {
      type: Boolean,
      default: false
    },
    clientSentAt: {
      type: String,
      required: [true, "MongoDB error: clientSentAt is required"]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

messageSchema.index({ chatId: 1, createdAt: -1 });

messageSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

type MessageModel = Model<TMessage>;

const messageModel =
  (mongoose.models.Message as MessageModel) ||
  mongoose.model("Message", messageSchema, "Message");

export default messageModel;
