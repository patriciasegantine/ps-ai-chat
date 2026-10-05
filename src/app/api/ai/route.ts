import {
  APICallError,
  convertToModelMessages,
  stepCountIs,
  streamText,
} from "ai";
import { NextResponse } from "next/server";
import { openrouter } from "@/ai/open-router";
import { tools } from "@/ai/tools";

const userErrorMessage = "Something went wrong. Please try again.";

export async function POST(request: Request) {
  
  const {messages} = await request.json()
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("[OpenRouter] Missing OPENROUTER_API_KEY in environment.");
    return NextResponse.json(
      { error: userErrorMessage },
      { status: 500 }
    );
  }

  try {
    const result = streamText({
      model: openrouter.chat("openai/gpt-4o"),
      tools,
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      system: `Always return Markdown answers.`,
      onError: ({ error }) => {
        console.error("[OpenRouter]", error);
      },
    });

    return result.toUIMessageStreamResponse({
      onError: () => userErrorMessage,
    });
    
  } catch (error) {
    console.error("[OpenRouter]", error);

    const status =
      APICallError.isInstance(error) && error.statusCode
        ? error.statusCode
        : 502;

    return NextResponse.json({ error: userErrorMessage }, { status });
  }
}
