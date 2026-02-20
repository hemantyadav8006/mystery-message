import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  content: string;
  createdAt: Date;
}

export type AuthProvider = "credentials" | "google";

export interface IUser {
  username: string;
  email: string;
  /** Required for credentials auth; omitted for OAuth-only users */
  password?: string;
  verifyCode?: string;
  verifyCodeExpires?: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: IMessage[];
  /** Default: "user". Enables future role-based access. */
  role: string;
  /** Profile image URL (e.g. from OAuth provider) */
  image?: string;
  /** How the user signed up; used for account linking and UX. */
  provider?: AuthProvider;
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
      required: false, // OAuth users may have no password
    },
    verifyCode: {
      type: String,
      required: false,
    },
    verifyCodeExpires: {
      type: Date,
      required: false,
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
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    image: {
      type: String,
      required: false,
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      required: false,
    },
  },
  { timestamps: true }
);

const userModel =
  (mongoose.models.User as mongoose.Model<User>) || // if model exist
  mongoose.model<User>("User", UserSchema); // if model is not present in the MongoDB

export { userModel };
