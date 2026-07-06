"use client";

import { Bot, User2 } from "lucide-react";
import { ChatScrollToBottomButton } from "./chat-scroll-to-bottom-button";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { MessageInput } from "./message-input";
import { Markdown } from "./markdown";
import { ToolLoading } from "./tool-loading";
import { GithubProfile } from "./github-profile";
import type { GithubProfileData } from "@/ai/tools/github_profile";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, getToolName, isToolUIPart } from "ai";

const chatTransport = new DefaultChatTransport({ api: "/api/ai" });

const toolLabels: Record<string, string> = {
  githubProfile: "Fetching GitHub profile",
  fetchHTTP: "Fetching URL content",
};

export function Chat() {
  const [input, setInput] = useState("");

  const { clearError, error, messages, sendMessage, status } = useChat({
    transport: chatTransport,
  });

  function handleInputChange(evt: ChangeEvent<HTMLTextAreaElement>) {
    setInput(evt.target.value);
  }

  async function handleSubmit(event?: { preventDefault(): void }) {
    event?.preventDefault();
    if (!input.trim()) return;
    clearError();
    await sendMessage({ text: input });
    setInput("");
  }
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, []);
  
  useEffect(() => {
    if (messages.length > 0 && status === 'streaming' && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [
    messages,
    status,
  ])
  
  return (
    <>
      <div className="flex-1 relative">
        <div
          ref={containerRef}
          className="space-y-6 absolute inset-0 overflow-y-scroll scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-zinc-900 scrollbar-track-transparent"
        >
          {messages.map(message => {
            return (
              <div className="flex items-start gap-3" key={message.id}>
                {message.role === "assistant" && (
                  <div className="size-7 rounded-md bg-zinc-900 flex items-center justify-center">
                    <Bot className="size-4 text-zinc-400" />
                  </div>
                )}
                
                {message.role === "user" && (
                  <div className="size-7 rounded-md bg-zinc-800 flex items-center justify-center">
                    <User2 className="size-3 text-zinc-100" />
                  </div>)
                }
                
                <div className="flex flex-col gap-4">
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <div key={index} className="flex-1 prose prose-invert prose-zinc prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
                          <Markdown>{part.text}</Markdown>
                        </div>
                      );
                    }

                    if (isToolUIPart(part)) {
                      if (part.state === "output-error") {
                        return (
                          <p key={index} role="alert" className="text-sm text-red-400">
                            {part.errorText}
                          </p>
                        );
                      }

                      if (part.state !== "output-available") {
                        const toolName = getToolName(part);
                        return (
                          <ToolLoading key={index} text={`${toolLabels[toolName] ?? `Running ${toolName}`}...`} />
                        );
                      }

                      if (getToolName(part) === "githubProfile") {
                        return (
                          <GithubProfile key={index} data={part.output as GithubProfileData} />
                        );
                      }
                    }

                    return null;
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <ChatScrollToBottomButton containerRef={containerRef} />
      </div>
      
      {error && (
        <p role="alert" className="text-sm text-red-400 px-1">
          {error.message}
        </p>
      )}

      <MessageInput
        disabled={status === "streaming" || status === "submitted"}
        value={input}
        onValueChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}
