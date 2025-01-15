import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(5, { message: "Username must be at least 5 characters long!" })
  .max(20, { message: "Username must be at most 20 characters long!" })
  .regex(/^[a-zA-Z0-9_]*$/, {
    message: "Username can only contain letters, numbers, and underscores!",
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Please fill a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
});
