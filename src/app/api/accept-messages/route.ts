import { withErrorHandler } from "@/lib/api-handler";
import { withAuth } from "@/middleware/auth.middleware";
import { messageService } from "@/services/message.service";
import { successResponse } from "@/lib/api-response";
import { acceptMessagesSchema } from "@/Schemas/message.schema";
import { ValidationError } from "@/lib/errors";

export const POST = withErrorHandler(
  withAuth(async (req, user) => {
    const body = await req.json();
    const result = acceptMessagesSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((i) => i.message);
      throw new ValidationError("Validation failed", errors);
    }

    const response = await messageService.updateAcceptStatus(
      user._id,
      result.data.acceptMessages
    );
    return successResponse(response.message);
  })
);

export const GET = withErrorHandler(
  withAuth(async (_req, user) => {
    const status = await messageService.getAcceptStatus(user._id);
    return successResponse("Accept status retrieved", status);
  })
);
