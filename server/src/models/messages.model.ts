import mongoose, { type Document, Model, Types } from "mongoose";

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
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file", "location"],
      default: "text"
    },
    meta: {
      readStatus: {
        hasRead: {
          type: Boolean,
          default: false
        },
        readAt: {
          type: Date,
          default: null
        }
      },
      deliveredStatus: {
        hasDelivered: {
          type: Boolean,
          default: false
        },
        deliveredAt: {
          type: Date,
          default: null
        }
      }
    },
    editted: {
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

messageSchema.index({ chatId: 1, createdAt: -1 });

messageSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

type MessageModel = Model<TMessage>;

const messageModel =
  (mongoose.models.Message as MessageModel) ||
  mongoose.model("Message", messageSchema, "Message");

export default messageModel;
