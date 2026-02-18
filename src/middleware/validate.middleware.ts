import { NextRequest } from "next/server";
import { ZodSchema } from "zod";
import { ValidationError } from "@/lib/errors";

export type ValidatedRouteHandler<T> = (
  req: NextRequest,
  data: T,
  context: { params: Promise<Record<string, string>> }
) => Promise<Response>;

export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: ValidatedRouteHandler<T>
) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<Response> => {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      throw new ValidationError("Validation failed", errors);
    }

    return handler(req, result.data, context);
  };
}

export function withQueryValidation<T>(
  schema: ZodSchema<T>,
  handler: (
    req: NextRequest,
    data: T,
    context: { params: Promise<Record<string, string>> }
  ) => Promise<Response>
) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<Response> => {
    const { searchParams } = new URL(req.url);
    const queryObj = Object.fromEntries(searchParams.entries());
    const result = schema.safeParse(queryObj);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      throw new ValidationError("Invalid query parameters", errors);
    }

    return handler(req, result.data, context);
  };
}
