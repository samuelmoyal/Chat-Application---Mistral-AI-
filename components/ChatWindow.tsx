// /components/ChatWindow.tsx
"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { ChatMessage } from "@/lib/storage";



interface ChatWindowProps {
  messages: ChatMessage[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-[600px] overflow-y-auto">
      {messages?.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">M</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Mistral Chat</h3>
          <p className="text-gray-500 max-w-md">
            Start a conversation with Mistral AI. Ask questions, get help with coding, writing, analysis, or just have a chat!
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              Code assistance
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              Writing help
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              Analysis
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              Q&A
            </span>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {messages?.map((msg, idx) => (
            <MessageBubble key={msg.id || idx} message={msg.content} isUser={msg.role === "user"} />
          ))}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}
