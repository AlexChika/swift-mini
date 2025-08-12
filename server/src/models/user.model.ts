import { User } from "swift-mini";
import { connectDB } from "lib/db";
const mongoose = await connectDB();
import { type Document, Model } from "mongoose";

type IUserDocument = User & Document;

const userSchema = new mongoose.Schema<User>({
  name: String,
  email: String,
  image: String,
  username: String,
  emailVerified: Boolean,
  userImageUrl: String,
  permanentImageUrl: String
});

type UserModel = Model<IUserDocument>;

const userModel =
  (mongoose.models.User as UserModel) ||
  mongoose.model("User", userSchema, "User");

export default userModel;
