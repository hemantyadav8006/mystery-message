import { withErrorHandler } from "@/lib/api-handler";
import { withValidation } from "@/middleware/validate.middleware";
import { withRateLimit } from "@/middleware/rate-limit.middleware";
import { sendMessageSchema, type SendMessageInput } from "@/Schemas/message.schema";
import { messageService } from "@/services/message.service";
import { successResponse } from "@/lib/api-response";
import { RATE_LIMITS } from "@/constants/config";

export const POST = withErrorHandler(
  withRateLimit(
    RATE_LIMITS.sendMessage,
    withValidation(sendMessageSchema, async (_req, data: SendMessageInput) => {
      const result = await messageService.sendMessage(data.username, data.content);
      return successResponse(result.message, undefined, 201);
    })
  )
);
