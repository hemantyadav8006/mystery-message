import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api-handler";
import { withAuth, type AuthenticatedUser } from "@/middleware/auth.middleware";
import { messageService } from "@/services/message.service";
import { successResponse } from "@/lib/api-response";

export const DELETE = withErrorHandler(
  withAuth(
    async (
      _req: NextRequest,
      user: AuthenticatedUser,
      context?: { params: Promise<Record<string, string>> }
    ): Promise<NextResponse> => {
      const { messageid } = (await context?.params) ?? {};
      const result = await messageService.deleteMessage(user._id, messageid);
      return successResponse(result.message);
    }
  )
);
