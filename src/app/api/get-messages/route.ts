import { withErrorHandler } from "@/lib/api-handler";
import { withAuth } from "@/middleware/auth.middleware";
import { messageService } from "@/services/message.service";
import { successResponse } from "@/lib/api-response";

export const GET = withErrorHandler(
  withAuth(async (_req, user) => {
    const messages = await messageService.getMessages(user._id);
    return successResponse("Messages retrieved successfully", messages);
  })
);
