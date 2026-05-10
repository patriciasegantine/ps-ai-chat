import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { openrouter } from "@/app/ai/open-router";
import { z } from "zod";


export async function GET() {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "Missing OPENROUTER_API_KEY in environment." },
      { status: 500 }
    );
  }

  try {
    const response = await generateObject({
      model: openrouter.chat("openai/gpt-4o-2024-11-20"),
      schema: z.object({
        pt: z.string().describe("Portuguese translation"),
        fr: z.string().describe("French translation"),
        it: z.string().describe("Italian translation"),
        es: z.string().describe("Spanish translation")
      }),
      prompt: 'Translate "Hello world" into Portuguese, French, Italian, and Spanish.',
      system: 'You are a helpful translation assistant. Return only the requested translations.',
    });

    return NextResponse.json({ translations: response.object });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected AI provider error.";
    const status = message.toLowerCase().includes("quota") ? 429 : 502;

    return NextResponse.json({ error: message }, { status });
  }
}
