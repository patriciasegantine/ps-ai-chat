import { stepCountIs, streamText, tool } from "ai";
import { NextResponse } from "next/server";
import { openrouter } from "@/ai/open-router";
import { z } from "zod/v3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "patriciasegantine";
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "Missing OPENROUTER_API_KEY in environment." },
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
            const res = await fetch(`https://api.github.com/users/${username}`);
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
        gitHubOrganizations: tool({
          description: "Fetches the list of GitHub organizations that a user belongs to.",
          inputSchema: z.object({
            username: z.string().describe("The GitHub username.")
          }),
          execute: async ({username}) => {
            const res = await fetch(`https://api.github.com/users/${username}/orgs`);
            console.log(`[gitHubOrganizations] Status: ${res.status}`);
            if (!res.ok) {
              throw new Error(`GitHub API error: ${res.statusText}`);
            }
            const orgs = (await res.json()) as Array<{
              login: string;
              description: string | null;
              avatar_url: string;
            }>;
            console.log(`[gitHubOrganizations] Organizations retrieved: ${orgs.length}`, orgs);
            return {
              username,
              organizations: orgs.map((org) => ({
                name: org.login,
                description: org.description,
                avatarUrl: org.avatar_url
              }))
            };
          }
        })
      },
      
      prompt: `Fetch a comprehensive GitHub profile for user "${username}". Get their name, repository count, repository URLs, and organizations. Provide a complete summary.`,
      stopWhen: stepCountIs(5),
      
      onStepFinish: ({toolResults}) => {
        console.log(toolResults);
      }
    });

    return result.toTextStreamResponse();
    
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected AI provider error.";
    const status = message.toLowerCase().includes("quota") ? 429 : 502;

    return NextResponse.json({ error: message }, { status });
  }
}
