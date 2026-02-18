import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, { message: "Username must be at least 4 characters long" })
  .max(20, { message: "Username must be at most 20 characters long" })
  .regex(/^[a-zA-Z0-9_]*$/, {
    message: "Username can only contain letters, numbers, and underscores",
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const signInSchema = z.object({
  identifier: z.string().min(1, { message: "Email or username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const verifyCodeSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  otp: z.string().length(6, { message: "Verification code must be 6 digits" }),
});

export const checkUsernameSchema = z.object({
  username: usernameValidation,
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
export type CheckUsernameInput = z.infer<typeof checkUsernameSchema>;
