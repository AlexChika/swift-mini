import mongoose, { type Document, Model, Types } from "mongoose";

type TUserDocument = User<Types.ObjectId> & Document;

const userSchema = new mongoose.Schema<User<Types.ObjectId>>(
  {
    name: String,
    email: String,
    image: String,
    username: String,
    emailVerified: Boolean,
    permanentImageUrl: String,
    lastSeen: {
      type: Date,
      default: Date.now
    },
    hideLastSeen: {
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

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

type UserModel = Model<TUserDocument>;

const userModel =
  (mongoose.models.User as UserModel) ||
  mongoose.model("User", userSchema, "User");

export default userModel;
