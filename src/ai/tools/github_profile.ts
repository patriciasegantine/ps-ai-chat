import { github } from "@/lib/octokit";
import { tool } from "ai";
import z from "zod";

export const githubProfile = tool({
    description: 'Fetches the GitHub profile information and public repository URLs for a given username.',
    inputSchema: z.object({
    username: z.string().describe("The GitHub username to query.")
    }),
    execute: async ({username}) => {
    const res = await github.users.getByUsername({username});
    
    return res.data
    }
})