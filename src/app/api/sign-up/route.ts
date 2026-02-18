import { withErrorHandler } from "@/lib/api-handler";
import { withValidation } from "@/middleware/validate.middleware";
import { withRateLimit } from "@/middleware/rate-limit.middleware";
import { signUpSchema, type SignUpInput } from "@/Schemas/user.schema";
import { userService } from "@/services/user.service";
import { successResponse } from "@/lib/api-response";
import { RATE_LIMITS } from "@/constants/config";

export const POST = withErrorHandler(
  withRateLimit(
    RATE_LIMITS.signUp,
    withValidation(signUpSchema, async (_req, data: SignUpInput) => {
      const result = await userService.signUp(data);
      return successResponse(result.message, undefined, 201);
    })
  )
);
