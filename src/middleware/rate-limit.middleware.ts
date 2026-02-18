import { NextRequest } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  type RateLimitConfig,
} from "@/lib/rate-limit";
import { RateLimitError } from "@/lib/errors";

type RouteHandler = (
  req: NextRequest,
  context: { params: Promise<Record<string, string>> }
) => Promise<Response>;

export function withRateLimit(config: RateLimitConfig, handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    const ip = getClientIp(req.headers);
    const key = `${req.method}:${req.nextUrl.pathname}:${ip}`;
    const result = checkRateLimit(key, config);

    if (!result.allowed) {
      throw new RateLimitError();
    }

    const response = await handler(req, context);
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    response.headers.set("X-RateLimit-Reset", String(result.resetTime));
    return response;
  };
}
