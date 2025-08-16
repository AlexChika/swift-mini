import { connectDB } from "lib/db";
const mongoose = await connectDB();
import { type Document, Model } from "mongoose";
import { Messages } from "swift-mini";

type TMessage = Document & Messages;

const messageSchema = new mongoose.Schema<Messages>(
  {
    chatId: {
      type: String,
      ref: "Chat",
      required: [true, "MongoDB error: ConversationId is required"]
    },
    senderId: {
      type: String,
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
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

messageSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

type MessageModel = Model<TMessage>;

const messageModel =
  (mongoose.models.Message as MessageModel) ||
  mongoose.model("Message", messageSchema, "Message");

export default messageModel;
