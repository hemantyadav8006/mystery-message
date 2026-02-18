import { withErrorHandler } from "@/lib/api-handler";
import { withQueryValidation } from "@/middleware/validate.middleware";
import { checkUsernameSchema, type CheckUsernameInput } from "@/Schemas/user.schema";
import { userService } from "@/services/user.service";
import { successResponse } from "@/lib/api-response";

export const GET = withErrorHandler(
  withQueryValidation(checkUsernameSchema, async (_req, data: CheckUsernameInput) => {
    const result = await userService.checkUsernameUnique(data.username);
    return successResponse(result.message);
  })
);
