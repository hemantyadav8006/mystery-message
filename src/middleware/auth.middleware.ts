import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthenticationError } from "@/lib/errors";

export interface AuthenticatedUser {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}

export type AuthenticatedRouteHandler = (
  req: NextRequest,
  user: AuthenticatedUser,
  context: { params: Promise<Record<string, string>> }
) => Promise<Response>;

export function withAuth(handler: AuthenticatedRouteHandler) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<Response> => {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      throw new AuthenticationError();
    }

    const user: AuthenticatedUser = {
      _id: session.user._id,
      username: session.user.username ?? "",
      email: session.user.email ?? "",
      isVerified: session.user.isVerified ?? false,
      isAcceptingMessages: session.user.isAcceptingMessages ?? false,
    };

    return handler(req, user, context);
  };
}
