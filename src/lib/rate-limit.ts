interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
  }

  entry.count++;

  if (entry.count > config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  return { allowed: true, remaining: config.maxRequests - entry.count, resetTime: entry.resetTime };
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
