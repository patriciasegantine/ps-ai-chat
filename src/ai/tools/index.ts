import type { TypedToolCall, TypedToolResult } from "ai";
import { githubProfile } from "./github_profile";
import { fetchHTTP } from "./http_fetch";

export const tools = {
  githubProfile,
  fetchHTTP
};

export type AIToolCall = TypedToolCall<typeof tools>
export type AIToolResult = TypedToolResult<typeof tools>
