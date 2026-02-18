import { NextRequest } from "next/server";
import { AppError, ValidationError } from "./errors";
import { errorResponse } from "./api-response";

type RouteContext = { params: Promise<Record<string, string>> };

export type RouteHandler = (
  req: NextRequest,
  context: RouteContext
) => Promise<Response>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context: RouteContext) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof ValidationError) {
        return errorResponse(error.message, error.statusCode, error.errors);
      }

      if (error instanceof AppError) {
        return errorResponse(error.message, error.statusCode);
      }

      const message =
        process.env.NODE_ENV === "production"
          ? "An unexpected error occurred"
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred";

      console.error("[API Error]", error);
      return errorResponse(message, 500);
    }
  };
}
