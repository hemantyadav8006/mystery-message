import dbConnect from "@/lib/dbConnect";
import {
  userModel,
  type User,
  type IMessage,
  type AuthProvider,
} from "@/model/User.model";
import mongoose from "mongoose";

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpires: Date;
}

export interface CreateOAuthUserData {
  email: string;
  username: string;
  image?: string;
  provider: AuthProvider;
}

export const userRepository = {
  async findById(id: string): Promise<User | null> {
    await dbConnect();
    return userModel.findById(id);
  },

  async findByEmail(email: string): Promise<User | null> {
    await dbConnect();
    return userModel.findOne({ email });
  },

  async findByUsername(username: string): Promise<User | null> {
    await dbConnect();
    return userModel.findOne({ username });
  },

  async findVerifiedByUsername(username: string): Promise<User | null> {
    await dbConnect();
    return userModel.findOne({ username, isVerified: true });
  },

  async findUnverifiedByUsername(username: string): Promise<User | null> {
    await dbConnect();
    return userModel.findOne({ username, isVerified: false });
  },

  async create(data: CreateUserData): Promise<User> {
    await dbConnect();
    const user = new userModel({
      ...data,
      isVerified: false,
      isAcceptingMessages: true,
      messages: [],
    });
    return user.save();
  },

  /** Idempotent: find by email or create OAuth user. No password. */
  async findOrCreateOAuthUser(data: CreateOAuthUserData): Promise<User> {
    await dbConnect();
    const existing = await userModel.findOne({ email: data.email });
    if (existing) return existing;
    const user = new userModel({
      email: data.email,
      username: data.username,
      image: data.image,
      provider: data.provider,
      isVerified: true,
      isAcceptingMessages: true,
      messages: [],
      role: "user",
    });
    return user.save();
  },

  async updateVerificationCode(
    userId: string,
    password: string,
    verifyCode: string,
    verifyCodeExpires: Date
  ): Promise<User | null> {
    await dbConnect();
    return userModel.findByIdAndUpdate(
      userId,
      { password, verifyCode, verifyCodeExpires },
      { new: true }
    );
  },

  async markAsVerified(userId: string): Promise<User | null> {
    await dbConnect();
    return userModel.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );
  },

  async updateAcceptingMessages(
    userId: string,
    isAcceptingMessages: boolean
  ): Promise<User | null> {
    await dbConnect();
    return userModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages },
      { new: true }
    );
  },

  async addMessage(
    userId: string,
    message: IMessage
  ): Promise<User | null> {
    await dbConnect();
    return userModel.findByIdAndUpdate(
      userId,
      { $push: { messages: message } },
      { new: true }
    );
  },

  async deleteMessage(
    userId: string,
    messageId: string
  ): Promise<{ modifiedCount: number }> {
    await dbConnect();
    return userModel.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageId } } }
    );
  },

  async getMessagesSorted(userId: string) {
    await dbConnect();
    const objectId = new mongoose.Types.ObjectId(userId);
    const result = await userModel.aggregate([
      { $match: { _id: objectId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!result || result.length === 0) {
      return [];
    }

    const messages = result[0].messages;
    if (messages.length === 1 && !messages[0]._id) {
      return [];
    }

    return messages;
  },
};
