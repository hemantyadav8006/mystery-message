import {
  GoogleGenerativeAI,
  type GenerativeModel,
  type GenerateContentResult,
} from "@google/generative-ai";
import { withRateLimit } from "@/middleware/rate-limit.middleware";
import { withErrorHandler } from "@/lib/api-handler";
import { RATE_LIMITS } from "@/constants/config";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
}

const genAI = new GoogleGenerativeAI(apiKey);

const SUGGESTION_PROMPT =
  "Generate 50 open-ended conversation starter questions for an anonymous social messaging platform like Qooh.me. The questions should be friendly, engaging, and suitable for a diverse audience. Avoid personal or sensitive topics. Return the questions as a single string separated by '||'.";

/* ---------------- CACHE ---------------- */

let cachedQuestions: string[] | null = null;
let cacheTime = 0;

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/* ---------------- RETRY LOGIC ---------------- */

async function generateWithRetry(
  model: GenerativeModel,
  prompt: string,
  retries = 3,
): Promise<GenerateContentResult> {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(prompt);
    } catch (error: unknown) {
      const typedError = error as { status?: number };
      if (typedError?.status === 429 && i < retries - 1) {
        const delay = 1000 * (i + 1);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Failed to generate content after retries");
}

/* ---------------- QUESTION GENERATOR ---------------- */
const FALLBACK_QUESTIONS = [
  "What's a skill you've always wanted to learn?",
  "What's the best advice you've ever received?",
  "If you could have dinner with anyone, who would it be?",
  "What's something that always makes you laugh?",
  "What's your favorite way to spend a weekend?",
  "What's a book or movie that changed your perspective?",
  "If you could live anywhere in the world, where would it be?",
  "What's something most people don't know about you?",
  "What's the most adventurous thing you've ever done?",
  "What's a goal you're currently working toward?",
];

async function getQuestions(model: GenerativeModel): Promise<string[]> {
  const now = Date.now();

  if (cachedQuestions && now - cacheTime < CACHE_DURATION) {
    return cachedQuestions;
  }

  try {
    const result = await generateWithRetry(model, SUGGESTION_PROMPT);
    const text = result.response.text();
    cachedQuestions = text
      .split("||")
      .map((q: string) => q.trim())
      .filter(Boolean);
    cacheTime = now;
    return cachedQuestions;
  } catch (error: unknown) {
    const typedError = error as { status?: number };
    if (typedError?.status === 429 || typedError?.status === 404) {
      console.warn("Gemini unavailable — using fallback questions");
      return FALLBACK_QUESTIONS; // your hardcoded array
    }
    throw error;
  }
}

/* ---------------- API ROUTE ---------------- */

export const POST = withErrorHandler(
  withRateLimit(RATE_LIMITS.suggestMessages, async (): Promise<Response> => {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    try {
      const questions = await getQuestions(model);

      const randomQuestions =
        questions && questions.length > 0
          ? questions.sort(() => 0.5 - Math.random()).slice(0, 3)
          : [];
      return Response.json({ questions: randomQuestions });
    } catch (error: unknown) {
      const typedError = error as {
        message?: string;
        status?: number;
        stack?: string;
      };

      console.error("❌ Gemini suggest-messages error:", {
        message: typedError?.message,
        status: typedError?.status,
        stack: typedError?.stack,
      });

      // ✅ Also return the error to the client temporarily for debugging
      return Response.json(
        {
          questions: [],
          debug_error: typedError?.message ?? "Unknown error",
        },
        { status: 500 },
      );
    }
  }),
);
