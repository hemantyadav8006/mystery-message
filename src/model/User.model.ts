import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpires: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
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
      required: [true, "Email is required!"],
      isLowerCase: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // simple regex for email validation
        "Please fill a valid email address",
      ],
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
      required: [true, "Verify code expires is required!"],
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
