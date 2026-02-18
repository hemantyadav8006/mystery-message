import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { withRateLimit } from "@/middleware/rate-limit.middleware";
import { withErrorHandler } from "@/lib/api-handler";
import { RATE_LIMITS } from "@/constants/config";

export const maxDuration = 30;

const SUGGESTION_PROMPT =
  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

export const POST = withErrorHandler(
  withRateLimit(RATE_LIMITS.suggestMessages, async () => {
    const result = await streamText({
      model: google("gemini-2.0-flash"),
      prompt: SUGGESTION_PROMPT,
    });

    return result.toTextStreamResponse();
  })
);
1