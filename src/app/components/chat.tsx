"use client";

import { Bot, User2 } from "lucide-react";
import { MessageInput } from "./message-input";
import { Markdown } from "./markdown";

export function Chat() {
  
  return (
    <>
      <div className="flex-1 relative">
        <div
          className="space-y-6 absolute inset-0 overflow-y-scroll scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-zinc-900 scrollbar-track-transparent"
        >
          <div className="flex items-start gap-3">
            <div className="size-7 rounded-md bg-zinc-900 flex items-center justify-center">
              <User2 className="size-4 text-zinc-100" />
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex-1 prose prose-invert prose-zinc prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
                <Markdown>Question</Markdown>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="size-7 rounded-md bg-zinc-900 flex items-center justify-center">
              <Bot className="size-4 text-zinc-400" />
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex-1 prose prose-invert prose-zinc prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
                <Markdown>Testing response</Markdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <MessageInput
        disabled={false}
        value={""}
        onValueChange={() => {}}
        onSubmit={() => {}}
      />
    </>
  );
}
