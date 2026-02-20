import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { userModel } from "@/model/User.model";
import { getOrCreateOAuthUser } from "@/services/auth.service";
import { getBaseUrl } from "@/constants/config";

interface NextAuthUser {
  id: string;
  _id: string;
  username: string;
  email: string;
  image?: string | null;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}

const isProduction = process.env.NODE_ENV === "production";

/** Allow only same-origin or relative callback URLs to prevent open redirect. */
function isAllowedRedirectUrl(url: string | null): boolean {
  if (!url || typeof url !== "string") return true;
  try {
    const base = getBaseUrl();
    const parsed = new URL(url, base);
    const allowedOrigin = new URL(base).origin;
    return parsed.origin === allowedOrigin && parsed.pathname.startsWith("/");
  } catch {
    return false;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
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

        if (!user.password) {
          throw new Error("This account uses Google sign-in. Please sign in with Google.");
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const googleProfile = profile as { picture?: string | null };
        const dbUser = await getOrCreateOAuthUser(
          {
            email: profile.email,
            name: profile.name ?? user.name,
            image: googleProfile.picture ?? user.image,
          },
          "google"
        );
        (user as NextAuthUser)._id = dbUser.id;
        (user as NextAuthUser).username = dbUser.username;
        (user as NextAuthUser).isVerified = dbUser.isVerified;
        (user as NextAuthUser).isAcceptingMessages = dbUser.isAcceptingMessages;
        if (dbUser.image) (user as NextAuthUser).image = dbUser.image;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = (user as NextAuthUser)._id?.toString();
        token.isVerified = (user as NextAuthUser).isVerified;
        token.isAcceptingMessages = (user as NextAuthUser).isAcceptingMessages;
        token.username = (user as NextAuthUser).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (isAllowedRedirectUrl(url)) {
        return url!.startsWith("/") ? `${baseUrl}${url}` : url!;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // refresh session every 24h
  },
  cookies: {
    sessionToken: {
      name: isProduction ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
