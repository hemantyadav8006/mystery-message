import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { userModel } from "@/model/User.model";

interface NextAuthUser {
  id: string;
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        await dbConnect();

        const user = await userModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });

        if (!user) {
          throw new Error("No user found with this email or username");
        }

        if (!user.isVerified) {
          throw new Error("Please verify your account before logging in");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          isAcceptingMessages: user.isAcceptingMessages,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
