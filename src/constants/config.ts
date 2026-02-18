export const APP_NAME = "Mystery Message | True Feedback";

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const RATE_LIMITS = {
  signUp: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  signIn: { windowMs: 15 * 60 * 1000, maxRequests: 10 },
  sendMessage: { windowMs: 60 * 1000, maxRequests: 10 },
  verifyCode: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  suggestMessages: { windowMs: 60 * 1000, maxRequests: 5 },
} as const;

export const VERIFICATION_CODE_EXPIRY_HOURS = 1;
export const BCRYPT_SALT_ROUNDS = 10;
