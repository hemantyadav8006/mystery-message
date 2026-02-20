import { userRepository } from "@/repositories/user.repository";
import type { AuthProvider } from "@/model/User.model";

/**
 * Auth service: OAuth-specific database logic.
 * Keeps NextAuth config (lib/auth.ts) free of DB details and allows
 * adding more providers (e.g. GitHub) with the same pattern.
 */

const USERNAME_MAX_LENGTH = 30;
const RANDOM_SUFFIX_LENGTH = 6;

function sanitizeUsernamePart(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, "").slice(0, USERNAME_MAX_LENGTH - RANDOM_SUFFIX_LENGTH - 1) || "user";
}

function randomAlphanumeric(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export interface OAuthProfile {
  email: string;
  name?: string | null;
  image?: string | null;
}

/**
 * Generates a unique username from email/name. Prefers name-based, falls back to email local part + random suffix.
 */
async function resolveUniqueUsername(
  email: string,
  name?: string | null
): Promise<string> {
  const base = name
    ? sanitizeUsernamePart(name)
    : sanitizeUsernamePart(email.split("@")[0]);
  let username = `${base}_${randomAlphanumeric(RANDOM_SUFFIX_LENGTH)}`;
  let exists = await userRepository.findByUsername(username);
  let attempts = 0;
  const maxAttempts = 10;
  while (exists && attempts < maxAttempts) {
    username = `${base}_${randomAlphanumeric(RANDOM_SUFFIX_LENGTH)}`;
    exists = await userRepository.findByUsername(username);
    attempts++;
  }
  if (exists) {
    username = `user_${randomAlphanumeric(10)}`;
  }
  return username;
}

/**
 * Idempotent get-or-create for OAuth users. Links by email; no duplicate users.
 * Used from NextAuth signIn callback only.
 */
export async function getOrCreateOAuthUser(
  profile: OAuthProfile,
  provider: AuthProvider
): Promise<{ id: string; username: string; email: string; image?: string; isVerified: boolean; isAcceptingMessages: boolean }> {
  const username = await resolveUniqueUsername(profile.email, profile.name);
  const user = await userRepository.findOrCreateOAuthUser({
    email: profile.email,
    username,
    image: profile.image ?? undefined,
    provider,
  });
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    image: user.image,
    isVerified: user.isVerified,
    isAcceptingMessages: user.isAcceptingMessages,
  };
}
