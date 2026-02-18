import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters" })
    .max(300, { message: "Content must be at most 300 characters" }),
});

export const sendMessageSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters" })
    .max(300, { message: "Content must be at most 300 characters" }),
});

export const acceptMessagesSchema = z.object({
  acceptMessages: z.boolean(),
});

export type MessageInput = z.infer<typeof messageSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type AcceptMessagesInput = z.infer<typeof acceptMessagesSchema>;
