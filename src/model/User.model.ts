import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  content: string;
  createdAt: Date;
}

export interface IUser {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpires: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: IMessage[];
}

export interface Message extends IMessage, Document {
  _id: Schema.Types.ObjectId;
}

export interface User extends IUser, Document {
  _id: Schema.Types.ObjectId;
}

const MessageSchema: Schema<Message> = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    verifyCode: {
      type: String,
      required: [true, "Verify code is required!"],
    },
    verifyCodeExpires: {
      type: Date,
      required: [true, "Verify code Expiry is required!"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

const userModel =
  (mongoose.models.User as mongoose.Model<User>) || // if model exist
  mongoose.model<User>("User", UserSchema); // if model is not present in the MongoDB

export { userModel };
