import { User } from "swift-mini";
import { connectDB } from "lib/db";
const mongoose = await connectDB();
import { type Document, Model, Types } from "mongoose";

type TUserDocument = User<Types.ObjectId> & Document;

const userSchema = new mongoose.Schema<User<Types.ObjectId>>(
  {
    name: String,
    email: String,
    image: String,
    username: String,
    emailVerified: Boolean,
    userImageUrl: String,
    permanentImageUrl: String,
    lastSeen: {
      type: Date,
      default: null
    },
    hideLastSeen: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

type UserModel = Model<TUserDocument>;

const userModel =
  (mongoose.models.User as UserModel) ||
  mongoose.model("User", userSchema, "User");

export default userModel;
