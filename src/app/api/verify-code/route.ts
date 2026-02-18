import { withErrorHandler } from "@/lib/api-handler";
import { withValidation } from "@/middleware/validate.middleware";
import { withRateLimit } from "@/middleware/rate-limit.middleware";
import { verifyCodeSchema, type VerifyCodeInput } from "@/Schemas/user.schema";
import { userService } from "@/services/user.service";
import { successResponse } from "@/lib/api-response";
import { RATE_LIMITS } from "@/constants/config";

export const POST = withErrorHandler(
  withRateLimit(
    RATE_LIMITS.verifyCode,
    withValidation(verifyCodeSchema, async (_req, data: VerifyCodeInput) => {
      const result = await userService.verifyCode(data);
      return successResponse(result.message);
    })
  )
);
