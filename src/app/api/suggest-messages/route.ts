import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  try {
    const body = await req.json();

    const { messages } = body;

    const result = await streamText({
      model: openai("gpt-4o"),
      prompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "An unexpected error occurred.",
          details: error.message || String(error),
        },
        { status: 500 }
      );
    }
  }
}
