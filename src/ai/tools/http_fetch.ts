import { tool } from "ai";
import z from "zod";

export const fetchHTTP = tool({
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
})