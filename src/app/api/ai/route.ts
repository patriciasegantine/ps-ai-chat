import {
  APICallError,
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
} from "ai";
import { NextResponse } from "next/server";
import { openrouter } from "@/ai/open-router";
import { z } from "zod/v3";

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
      tools: {
        profileAndUrls: tool({
          description: 'Fetches the GitHub profile information and public repository URLs for a given username.',
          inputSchema: z.object({
            username: z.string().describe("The GitHub username to query.")
          }),
          execute: async ({username}) => {
            const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
            if (!res.ok) {
              throw new Error(`GitHub API error: ${res.statusText}`);
            }
            const data = await res.json();
            
           return JSON.stringify(data)
          }
        }),
        
        fetchHTTP: tool({
          description: "Fetches and returns the raw text content from a provided URL.",
          inputSchema: z.object({
            url: z.string().describe("The URL to be fetched. Limited to first 5000 characters.")
          }),
          execute: async ({url}) => {
            const res = await fetch(url);
            if (!res.ok) {
              throw new Error(`URL fetch error: ${res.statusText}`);
            }
            return (await res.text()).substring(0, 5000);
          }
        }),
      },
      
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
